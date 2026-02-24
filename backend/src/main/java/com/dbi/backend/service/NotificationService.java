package com.dbi.backend.service;

import com.dbi.backend.entity.Notification;
import com.dbi.backend.entity.User;
import com.dbi.backend.repository.NotificationRepository;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void createNotification(Long userId, String message, String type, Long applicationId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setApplicationId(applicationId);
        notificationRepository.save(notification);
        
        userRepository.findById(userId).ifPresent(user -> {
            sendSMS(user.getMobileNumber(), message);
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                sendEmail(user.getEmail(), "Application Update", message);
            }
        });
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    private void sendSMS(String mobile, String message) {
        System.out.println("[SMS] To: " + mobile + " | Message: " + message);
    }
    
    private void sendEmail(String email, String subject, String body) {
        System.out.println("[EMAIL] To: " + email + " | Subject: " + subject + " | Body: " + body);
    }
}
