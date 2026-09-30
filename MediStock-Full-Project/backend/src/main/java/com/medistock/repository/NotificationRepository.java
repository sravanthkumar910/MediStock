package com.medistock.repository;

import com.medistock.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdOrUserIsNullOrderByCreatedAtDesc(Long userId, Pageable pageable);
    long countByUserIdOrUserIsNullAndIsReadFalse(Long userId);
}
