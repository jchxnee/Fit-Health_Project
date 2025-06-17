package com.fithealth.backend.entity;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
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
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVATION_NO")
    private Long reservationNo;

    @ManyToOne
    @JoinColumn(name = "PAYMENT_ID", nullable = false)
    private Payment payment;

    @Column(name = "SELECT_DATE", nullable = false)
    private LocalDate selectDate;

    @Column(name = "CREATE_DATE", nullable = false)
    private LocalDate createDate;

    @Column(name = "REJECT_COMMENT", length = 50)
    private String rejectComment;

    @Column(name = "STATUS", nullable = false, length = 10)
    private CommonEnums.Status status;;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDate.now();

        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }
}
