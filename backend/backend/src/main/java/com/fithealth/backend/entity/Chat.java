package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "CHAT")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_NO")
    private long chatNo;

    @Column(name = "PAYMENT_ID")
    private long paymentId;


    @Column(name = "USER_EMAIL")
    private String userEmail;

    @Column(name = "STATUS", length = 1)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "READ_STATUS", length = 1)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status readStatus;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        if(status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }
}
