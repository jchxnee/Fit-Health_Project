package com.fithealth.backend.dto.Payment;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums; // CommonEnums 임포트
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private CommonEnums.Status paymentstatus;
    private LocalDateTime paymentAt;
    private Long productPrice;
    private String productName;
    private Long totalCount;
    private LocalDateTime firstReservation;
    private CommonEnums.UseStatus useStatus;


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long payment_id;
        private String user_name;
        private String trainer_name;
        private Long trainer_no;
        private String user_phone;
        private CommonEnums.Status payment_status;
        private Long product_price;
        private String product_name;
        private Long total_count;
        private LocalDateTime first_reservation;
        private Long once_price;
        private Long discount_3;
        private Long discount_5;
        private Long discount_10;

        public static ResponsePaymentDto.Response toDto(Payment payment) {
            return Response.builder()
                    .payment_id(payment.getPaymentId())
                    .user_name(payment.getMember().getUserName())
                    .trainer_name(payment.getResponseMember().getUserName())
                    .user_phone(payment.getMember().getPhone())
                    .payment_status(payment.getPaymentStatus())
                    .trainer_no(payment.getResponseMember().getTrainer().getTrainerNo())
                    .product_price(payment.getProductPrice())
                    .product_name(payment.getProductName())
                    .total_count(payment.getTotalCount())
                    .first_reservation(payment.getFirstReservation())
                    .once_price(payment.getResponseMember().getTrainer().getOncePrice())
                    .discount_3(payment.getResponseMember().getTrainer().getDiscount3())
                    .discount_5(payment.getResponseMember().getTrainer().getDiscount5())
                    .discount_10(payment.getResponseMember().getTrainer().getDiscount10())
                    .build();
        }

    }
}