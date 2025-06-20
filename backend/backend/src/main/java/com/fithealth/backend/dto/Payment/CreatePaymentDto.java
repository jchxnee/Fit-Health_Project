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
        private String userEmail; // 결제자 이메일 (Member의 USER_EMAIL)
        private String trainerEmail; // 응답자(트레이너) 이메일 (Member의 USER_EMAIL)
        private String transactionId;
        private String paymentMethod;
        private Long productPrice;
        private String productName;
        private Long totalCount;
        private LocalDateTime firstReservation;

        public Payment toEntity() {
            return Payment.builder()
                    // Member 엔티티(member, responseMember)는 서비스 계층에서 조회 후 설정
                    .transactionId(this.transactionId)
                    .paymentMethod(this.paymentMethod)
                    .productPrice(this.productPrice)
                    .productName(this.productName)
                    .totalCount(this.totalCount)
                    .firstReservation(this.firstReservation)
                    .build();
        }
    }
}