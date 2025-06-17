package com.fithealth.backend.entity;

import com.fithealth.backend.entity.Member;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "PAYMENT")
public class Payment {

    @Id
    @Column(name = "PAYMENT_ID")
    private Long paymentId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REQUEST_NAME", nullable = false)
    private Member requestMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESPONSE_NAME", nullable = false)
    private Member responseMember;

    @Column(name = "TRANSACTION_ID", length = 100)
    private String transactionId;

    @Column(name = "PAYMENT_METHOD", nullable = false, length = 10)
    private String paymentMethod;

    @Column(name = "PAYMENT_STATUS", nullable = false, length = 10)
    private String paymentStatus;

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
}
