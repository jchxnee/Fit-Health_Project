// com.fithealth.backend.dto.Reservation.ReservationCreateDto.java
package com.fithealth.backend.dto.Reservation;

import com.fithealth.backend.entity.Reservation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class ReservationCreateDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create{
        private Long payment_id;
        private String transaction_id; // 프론트에서 받은 merchant_uid
        private String payment_method; // 프론트에서 받은 pay_method
        private LocalDateTime select_date;

        public Reservation toEntity(){
            return Reservation.builder()
                    .selectDate(this.select_date)
                    .build();
        }
    }
}