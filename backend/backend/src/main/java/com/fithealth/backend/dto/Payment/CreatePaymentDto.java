package com.fithealth.backend.dto.Payment;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CreatePaymentDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        private String user_email; // 결제자 이메일 (Member의 USER_EMAIL)
        private String trainer_email; // 응답자(트레이너) 이메일 (Member의 USER_EMAIL)
        private Long product_price;
        private String product_name;
        private Long total_count;
        private LocalDateTime first_reservation;

        public Payment toEntity() {
            return Payment.builder()
                    .productPrice(this.product_price)
                    .productName(this.product_name)
                    .totalCount(this.total_count)
                    .firstReservation(this.first_reservation)
                    .build();
        }
    }
}