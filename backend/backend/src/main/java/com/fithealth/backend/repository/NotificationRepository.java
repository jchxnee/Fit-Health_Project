package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Notification;
import com.fithealth.backend.enums.CommonEnums;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Long countNotification(String userEmail, CommonEnums.Status status);

    List<Notification> selectNotification(String userEmail);
}
