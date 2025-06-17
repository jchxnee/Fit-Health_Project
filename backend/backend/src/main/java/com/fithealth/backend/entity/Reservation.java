package com.fithealth.backend.entity;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
<<<<<<< HEAD
import lombok.*;
=======
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
>>>>>>> a33b1be39a972e588d1536c925062ab69a8e170c

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVATION")
<<<<<<< HEAD
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
=======
@Builder
@AllArgsConstructor
@NoArgsConstructor
>>>>>>> a33b1be39a972e588d1536c925062ab69a8e170c
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

    @PrePersist
    public void prePersist() {
        this.selectDate = LocalDate.now();
        this.createDate = LocalDate.now();

        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }
}
