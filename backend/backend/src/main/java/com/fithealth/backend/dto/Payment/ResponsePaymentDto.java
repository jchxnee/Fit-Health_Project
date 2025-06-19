package com.fithealth.backend.dto.Payment;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums; // CommonEnums 임포트
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsePaymentDto {

    private Long paymentId;
    private String userEmail;
    private String userName;
    private String trainerEmail;
    private String trainerName;
    private String transactionId;
    private String paymentMethod;
    private CommonEnums.Status status;
    private LocalDate paymentAt;
    private Long productPrice;
    private String productName;
    private Long totalCount;
    private LocalDate firstReservation;
    private CommonEnums.Status useStatus;


    public static ResponsePaymentDto fromEntity(Payment payment) {
        String userEmail = null;
        String userName = null;
        if (payment.getMember() != null) {
            userEmail = payment.getMember().getUserEmail();
            userName = payment.getMember().getUserName();
        }

        String trainerEmail = null;
        String trainerName = null;
        if (payment.getResponseMember() != null) {
            trainerEmail = payment.getResponseMember().getUserEmail();
            trainerName = payment.getResponseMember().getUserName();
        }

        return ResponsePaymentDto.builder()
                .paymentId(payment.getPaymentId())
                .userEmail(userEmail)
                .userName(userName)
                .trainerEmail(trainerEmail)
                .trainerName(trainerName)
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentAt(payment.getPaymentAt())
                .productPrice(payment.getProductPrice())
                .productName(payment.getProductName())
                .totalCount(payment.getTotalCount())
                .firstReservation(payment.getFirstReservation())
                .useStatus(payment.getUseStatus())
                .build();
    }
}