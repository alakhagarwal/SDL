package com.sdl.backend.service;

import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.Notification;
import com.sdl.backend.model.User;
import com.sdl.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification sendNotification(User recipient, String type, String title, String message, String actionUrl) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .message(message)
                .actionUrl(actionUrl)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long recipientId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(recipientId);
    }

    public long getUnreadCount(Long recipientId) {
        return notificationRepository.countByRecipientUserIdAndIsReadFalse(recipientId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        if (notification.getRecipient().getUserId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
