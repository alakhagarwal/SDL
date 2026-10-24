package com.sdl.backend.repository;

import com.sdl.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientId);
    long countByRecipientUserIdAndIsReadFalse(Long recipientId);
}
