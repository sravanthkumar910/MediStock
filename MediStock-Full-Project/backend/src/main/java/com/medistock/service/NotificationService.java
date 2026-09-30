package com.medistock.service;

import com.medistock.entity.*;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Generates low-stock / expiry notifications and (optionally) emails them out.
 * Scheduled jobs run daily; can also be triggered manually via the controller.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final MedicineRepository medicineRepository;
    private final JavaMailSender mailSender;

    @Value("${medistock.alerts.expiry-warning-days}")
    private int expiryWarningDays;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public Page<Notification> list(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrUserIsNullOrderByCreatedAtDesc(userId, pageable);
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByUserIdOrUserIsNullAndIsReadFalse(userId);
    }

    public void markAsRead(Long id, Long userId) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser() != null && !n.getUser().getId().equals(userId)) {
                throw new AccessDeniedException("You cannot update another user's notification");
            }
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    /** Runs every day at 07:00 server time - scans inventory and raises alerts. */
    @Scheduled(cron = "0 0 7 * * *")
    public void runDailyInventoryScan() {
        log.info("Running scheduled inventory scan for low-stock and expiry alerts");
        checkLowStock();
        checkExpiry();
    }

    public void checkLowStock() {
        List<Medicine> lowStock = medicineRepository.findLowStock();
        for (Medicine m : lowStock) {
            NotificationType type = m.getQuantity() == 0 ? NotificationType.OUT_OF_STOCK : NotificationType.LOW_STOCK;
            String title = type == NotificationType.OUT_OF_STOCK ? "Out of stock" : "Low stock alert";
            String message = String.format("%s (batch %s) has %d unit(s) left (reorder level: %d).",
                    m.getName(), m.getBatchNumber(), m.getQuantity(), m.getReorderLevel());
            saveNotification(type, title, message, m);
        }
    }

    public void checkExpiry() {
        LocalDate cutoff = LocalDate.now().plusDays(expiryWarningDays);
        for (Medicine m : medicineRepository.findExpiringBefore(cutoff)) {
            String message = String.format("%s (batch %s) expires on %s.", m.getName(), m.getBatchNumber(), m.getExpiryDate());
            saveNotification(NotificationType.EXPIRY_WARNING, "Medicine nearing expiry", message, m);
        }
        for (Medicine m : medicineRepository.findExpired()) {
            String message = String.format("%s (batch %s) expired on %s and should be removed from active stock.",
                    m.getName(), m.getBatchNumber(), m.getExpiryDate());
            saveNotification(NotificationType.EXPIRED, "Medicine expired", message, m);
        }
    }

    private void saveNotification(NotificationType type, String title, String message, Medicine medicine) {
        Notification notification = Notification.builder()
                .type(type)
                .title(title)
                .message(message)
                .medicine(medicine)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        sendEmailSafely(title, message);
    }

    private void sendEmailSafely(String subject, String body) {
        if (fromAddress == null || fromAddress.isBlank()) {
            return; // email not configured - notification is still stored in-app
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromAddress);
            mail.setTo(fromAddress); // in production: send to configured admin/pharmacist distribution list
            mail.setSubject("[MediStock] " + subject);
            mail.setText(body);
            mailSender.send(mail);
        } catch (Exception e) {
            log.warn("Failed to send notification email: {}", e.getMessage());
        }
    }
}
