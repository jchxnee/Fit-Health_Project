package com.fithealth.backend.entity;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "RESERVATION")
public class Reservation {

    @Id
    @OneToOne
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
}
