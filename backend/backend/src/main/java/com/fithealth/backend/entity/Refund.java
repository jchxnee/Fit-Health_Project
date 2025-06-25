package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "REFUND")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REFUND_ID")
    private Long refundId;

    @OneToOne
    @JoinColumn(name = "PAYMENT_ID", nullable = false, unique = true)
    private Payment payment;

    @Column(name = "TRANSACTION_ID", length = 100)
    private String transactionId;

    @Column(name = "REFUND_METHOD", length = 10)
    private String paymentMethod;

    @Column(name = "REFUND_PRICE", nullable = false)
    private Long refundPrice;

    @Column(name = "REFUND_FEE", nullable = false)
    private Long refundFee;

    @Column(name = "REFUND_AT")
    private LocalDateTime refundAt;

    @PrePersist
    public void prePersist() {
        this.refundAt = LocalDateTime.now();
    }

    public void changePayment(Payment payment) {
        this.payment = payment;
    }
}
