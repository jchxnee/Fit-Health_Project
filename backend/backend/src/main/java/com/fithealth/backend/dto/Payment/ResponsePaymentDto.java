package com.fithealth.backend.dto.Payment;

import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.enums.CommonEnums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsePaymentDto {

    // 이 부분은 기존 Request/General Response DTO로 유지
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
    public static class Response { // 이 DTO를 결제 상세 조회 응답용으로 사용
        private Long payment_id;
        private String user_name;
        private String user_email; // 사용자 이메일 추가
        private String trainer_name;
        private String trainer_email; // 트레이너 이메일 추가
        private Long trainer_no;
        private String user_phone;
        private String transaction_id;
        private String payment_method;
        private CommonEnums.Status payment_status;
        private LocalDateTime payment_at;
        private Long product_price;
        private String product_name;
        private Long total_count;
        private Long used_count;
        private LocalDateTime first_reservation;
        private CommonEnums.UseStatus use_status;
        private LocalDateTime applied_at;
        private boolean has_review;
        private boolean has_refund;
        private Long once_price;
        private Long discount_3;
        private Long discount_5;
        private Long discount_10;

        public static Response toDto(Payment payment) {
            return Response.builder()
                    .payment_id(payment.getPaymentId())
                    .user_name(payment.getMember().getUserName())
                    .user_email(payment.getMember().getUserEmail()) // 사용자 이메일 매핑
                    .trainer_name(payment.getResponseMember().getUserName())
                    .trainer_email(payment.getResponseMember().getUserEmail()) // 트레이너 이메일 매핑
                    .user_phone(payment.getMember().getPhone())
                    .transaction_id(payment.getTransactionId()) // 매핑
                    .payment_method(payment.getPaymentMethod()) // 매핑
                    .payment_status(payment.getPaymentStatus())
                    .payment_at(payment.getPaymentAt()) // 매핑
                    .product_price(payment.getProductPrice())
                    .product_name(payment.getProductName())
                    .total_count(payment.getTotalCount())
                    .used_count(payment.getUsedCount()) // 매핑
                    .first_reservation(payment.getFirstReservation())
                    .use_status(payment.getUseStatus()) // 매핑
                    .applied_at(payment.getAppliedAt()) // 매핑
                    .has_review(payment.getReview() != null) // 매핑
                    .has_refund(payment.getRefund() != null) // 매핑
                    .trainer_no(payment.getResponseMember().getTrainer() != null ? payment.getResponseMember().getTrainer().getTrainerNo() : null)
                    .once_price(payment.getResponseMember().getTrainer() != null ? payment.getResponseMember().getTrainer().getOncePrice() : null)
                    .discount_3(payment.getResponseMember().getTrainer() != null ? payment.getResponseMember().getTrainer().getDiscount3() : null)
                    .discount_5(payment.getResponseMember().getTrainer() != null ? payment.getResponseMember().getTrainer().getDiscount5() : null)
                    .discount_10(payment.getResponseMember().getTrainer() != null ? payment.getResponseMember().getTrainer().getDiscount10() : null)
                    .build();
        }
    }
}