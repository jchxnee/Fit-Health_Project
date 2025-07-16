package com.fithealth.backend.entity;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVATION")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVATION_NO")
    private Long reservationNo;

    @ManyToOne
    @JoinColumn(name = "PAYMENT_ID", nullable = false)
    private Payment payment;

    @Column(name = "SELECT_DATE", nullable = false)
    private LocalDateTime selectDate;

    @Column(name = "CREATED_DATE", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "REJECT_COMMENT", length = 50)
    private String rejectComment;

    @Column(name = "STATUS", nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();

        if(this.status == null) {
            this.status = CommonEnums.Status.N;
        }
    }

    public void changePayment(Payment payment) {
        this.payment = payment;
        if(!payment.getReservations().contains(this)){
            payment.getReservations().add(this);
        } else{
            payment.getReservations().remove(this);
        }
    }

}
