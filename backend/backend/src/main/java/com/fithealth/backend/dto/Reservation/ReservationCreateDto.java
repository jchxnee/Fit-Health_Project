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
        private LocalDateTime select_date;

        public Reservation toEntity(){
            return Reservation.builder()
                    .selectDate(this.select_date)
                    .build();
        }
    }
}
