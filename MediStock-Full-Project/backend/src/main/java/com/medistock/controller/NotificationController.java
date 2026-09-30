package com.medistock.controller;

import com.medistock.entity.Notification;
import com.medistock.entity.User;
import com.medistock.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

/**
 *   GET   /api/notifications              - list notifications for the current user (+ broadcast)
 *   GET   /api/notifications/unread-count - unread notification count
 *   PATCH /api/notifications/{id}/read    - mark one notification as read
 *   POST  /api/notifications/scan         - manually trigger a low-stock/expiry scan (Admin/Pharmacist)
 */
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public Page<Notification> list(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        User actor = CurrentUserResolver.currentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return notificationService.list(actor != null ? actor.getId() : null, pageable);
    }

    @GetMapping("/unread-count")
    public long unreadCount() {
        User actor = CurrentUserResolver.currentUser();
        return notificationService.unreadCount(actor != null ? actor.getId() : null);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        User actor = CurrentUserResolver.currentUser();
        notificationService.markAsRead(id, actor.getId());
    }

    @PostMapping("/scan")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public void triggerScan() {
        notificationService.checkLowStock();
        notificationService.checkExpiry();
    }
}
