package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Entity
@Builder
@Table(name = "NOTIFICATION")
public class Notification {

    @Id
    @Column(name = "NOTIFICATION_NO")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL", nullable = false, referencedColumnName = "USER_EMAIL")
    private Member member;

    @Column(name = "MESSAGE", nullable = false, length = 255)
    private String message;

    @Column(name = "NOTIFICATION_TYPE", nullable = false, length = 100)
    private String notificationType;

    @Column(name = "RELATED_ID")
    private Long relatedId;

    @Column(name = "IS_READ")
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status isRead;

    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
    private LocalDateTime createdDate;


    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    if(this.isRead == null) {
        this.isRead = CommonEnums.Status.N;
    }
    }
}
