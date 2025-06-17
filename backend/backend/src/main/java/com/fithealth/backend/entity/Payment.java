package com.fithealth.backend.entity;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @Column(name = "PAYMENT_ID")
    private Long paymentId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL", nullable = false)
    private Member userMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL", nullable = false)
    private Member trainerMember;

    @Column(name = "TRANSACTION_ID", length = 100)
    private String transactionId;

    @Column(name = "PAYMENT_METHOD", nullable = false, length = 10)
    private String paymentMethod;

    @Column(name = "STATUS", nullable = false, length = 10)
    private CommonEnums.Status status;

    @Column(name = "PAYMENT_AT", nullable = false)
    private LocalDate paymentAt;

    @Column(name = "PRODUCT_PRICE", nullable = false)
    private Long productPrice;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 255)
    private String productName;

    @Column(name = "TOTAL_COUNT", nullable = false)
    private Long totalCount;

    @Column(name = "FIRST_RESERVATION", nullable = false)
    private LocalDate firstReservation;


    @PrePersist
    public void prePersist() {
        this.firstReservation = LocalDate.now();
        this.paymentAt = LocalDate.now();

        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }
}
