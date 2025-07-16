package com.fithealth.backend.dto.Payment;

import com.fithealth.backend.dto.Payment.ResponsePaymentDto.Response;
import com.fithealth.backend.dto.Reservation.SelectReservation;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.enums.CommonEnums;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.time.format.DateTimeFormatter; // 이 import는 이제 startDate에는 필요 없지만, 다른 필드에서 사용될 수 있으니 일단 유지합니다.
import java.util.stream.Collectors;

public class SelectPaymentDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long paymentId;
        private String userEmail;
        private String userName;
        private String trainerEmail;
        private String trainerName;
        private Long trainerNo;
        private String transactionId;
        private String paymentMethod;
        private String status;
        private LocalDateTime paymentAt;
        private Long productPrice;
        private String productName;
        private String sessions;
        private LocalDateTime startDate; // ⭐ 여기를 LocalDateTime으로 변경 ⭐
        private String category;
        private boolean hasReview;
        private boolean hasRefund;
        private boolean isRefund;
        private Long totalCount;
        private Long refundPrice;
        private Long refundFee;

        private List<SelectReservation.Response> history;

        public static SelectPaymentDto.Response fromEntity(Payment payment) {
            String userEmail = null;
            String userName = null;
            if (payment.getMember() != null) {
                userEmail = payment.getMember().getUserEmail();
                userName = payment.getMember().getUserName();
            }

            String trainerEmail = null;
            String trainerName = null;
            String category = null;
            if (payment.getResponseMember() != null) {
                Member trainerMember = payment.getResponseMember();
                System.out.println("트레이너의 이름은 ? ? ? : " + trainerMember.getUserName());
                trainerEmail = trainerMember.getUserEmail();
                trainerName = trainerMember.getUserName();
                if (trainerMember.getTrainer() != null) {
                    category = trainerMember.getTrainer().getMajorName();
                }
            }

            long completedSessionsCount = 0;
            if (payment.getReservations() != null) {
                completedSessionsCount = payment.getReservations().stream()
                        .filter(reservation -> reservation.getStatus() == CommonEnums.Status.Y)
                        .count();
            }

            String displaySessions = completedSessionsCount + " / " + payment.getTotalCount();

            String displayStatus;
            if (payment.getUseStatus() == CommonEnums.UseStatus.N) {
                displayStatus = "완료됨";
            } else if (payment.getUseStatus() == CommonEnums.UseStatus.C) {
                displayStatus = "취소됨";
            } else {
                if (completedSessionsCount < payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    displayStatus = "진행중";
                } else if (completedSessionsCount == payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    displayStatus = "완료됨";
                } else {
                    displayStatus = "알 수 없음";
                }
            }

            // ⭐ LocalDateTime 타입으로 직접 할당 ⭐
            LocalDateTime displayStartDate = null;
            if (payment.getFirstReservation() != null) {
                displayStartDate = payment.getFirstReservation();
            }

            List<SelectReservation.Response> reservationHistory = null;
            if (payment.getReservations() != null && !payment.getReservations().isEmpty()) {
                reservationHistory = payment.getReservations().stream()
                        .map(SelectReservation.Response::fromEntity)
                        .toList();
            }

            boolean hasReview = false;
            if (payment.getReview() != null) {
                hasReview = true;
            } else {
                hasReview = false;
            }

            boolean isRefundable = false;

            if ("취소됨".equals(displayStatus)) {
                isRefundable = false;
            } else if(completedSessionsCount ==0){
                isRefundable = true;
            } else {
                Long totalCount = payment.getTotalCount();
                if (totalCount == 1 || totalCount == 2
                        || totalCount == 3 || totalCount == 5
                        || totalCount == 10) {
                    isRefundable = false;
                }
                else if (totalCount == 4) {
                    if (completedSessionsCount == 3) {
                        isRefundable = true;
                    } else {
                        isRefundable = false;
                    }
                }
                else if (totalCount >= 6 && totalCount <= 9) {
                    if (completedSessionsCount >= 5) {
                        isRefundable = true;
                    } else {
                        isRefundable = false;
                    }
                }
                else if (totalCount >= 11) {
                    if (completedSessionsCount >= 10) {
                        isRefundable = true;
                    } else {
                        isRefundable = false;
                    }
                }
            }

            boolean hasRefund = payment.getRefund() != null;

            return Response.builder()
                    .paymentId(payment.getPaymentId())
                    .userEmail(userEmail)
                    .userName(userName)
                    .trainerEmail(trainerEmail)
                    .trainerName(trainerName)
                    .trainerNo(payment.getResponseMember().getTrainer().getTrainerNo())
                    .transactionId(payment.getTransactionId())
                    .paymentMethod(payment.getPaymentMethod())
                    .status(displayStatus)
                    .paymentAt(payment.getPaymentAt())
                    .productPrice(payment.getProductPrice())
                    .productName(payment.getProductName())
                    .sessions(displaySessions)
                    .startDate(displayStartDate) // ⭐ 변경된 타입으로 할당 ⭐
                    .category(category)
                    .history(reservationHistory)
                    .hasReview(hasReview)
                    .hasRefund(hasRefund)
                    .isRefund(isRefundable)
                    .totalCount(payment.getTotalCount())
                    .refundPrice(payment.getRefund() != null ? payment.getRefund().getRefundPrice() : null)
                    .refundFee(payment.getRefund() != null ? payment.getRefund().getRefundFee() : null)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponseTrainer {
        private Long paymentId;
        private String userEmail;
        private String userName;
        private String trainerEmail;
        private String trainerName;
        private String transactionId;
        private String paymentMethod;
        private String status;
        private LocalDateTime paymentAt;
        private Long productPrice;
        private String productName;
        private String sessions;
        private LocalDateTime startDate; // ⭐ 여기도 LocalDateTime으로 변경 ⭐
        private String category;
        private Long totalCount;
        private boolean hasSalary;

        private List<SelectReservation.Response> history;

        public static SelectPaymentDto.ResponseTrainer fromEntity(Payment payment) {
            String userEmail = null;
            String userName = null;
            if (payment.getMember() != null) {
                userEmail = payment.getMember().getUserEmail();
                userName = payment.getMember().getUserName();
            }

            String trainerEmail = null;
            String trainerName = null;
            String category = null;
            if (payment.getResponseMember() != null) {
                Member trainerMember = payment.getResponseMember();
                System.out.println("트레이너의 이름은 ? ? ? : " + trainerMember.getUserName());
                trainerEmail = trainerMember.getUserEmail();
                trainerName = trainerMember.getUserName();
                if (trainerMember.getTrainer() != null) {
                    category = trainerMember.getTrainer().getMajorName();
                }
            }

            long completedSessionsCount = 0;
            if (payment.getReservations() != null) {
                completedSessionsCount = payment.getReservations().stream()
                        .filter(reservation -> reservation.getStatus() == CommonEnums.Status.Y)
                        .count();
            }

            String displaySessions = completedSessionsCount + " / " + payment.getTotalCount();

            String displayStatus;
            if (payment.getUseStatus() == CommonEnums.UseStatus.N) {
                displayStatus = "완료됨";
            } else if (payment.getUseStatus() == CommonEnums.UseStatus.C) {
                displayStatus = "취소됨";
            } else {
                if (completedSessionsCount < payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    displayStatus = "진행중";
                } else if (completedSessionsCount == payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    displayStatus = "완료됨";
                } else {
                    displayStatus = "알 수 없음";
                }
            }

            // ⭐ LocalDateTime 타입으로 직접 할당 ⭐
            LocalDateTime displayStartDate = null;
            if (payment.getFirstReservation() != null) {
                displayStartDate = payment.getFirstReservation();
            }

            List<SelectReservation.Response> reservationHistory = null;
            if (payment.getReservations() != null && !payment.getReservations().isEmpty()) {
                reservationHistory = payment.getReservations().stream()
                        .map(SelectReservation.Response::fromEntity)
                        .toList();
            }

            boolean hasSalary = payment.getSalary() != null;

            return ResponseTrainer.builder()
                    .paymentId(payment.getPaymentId())
                    .userEmail(userEmail)
                    .userName(userName)
                    .trainerEmail(trainerEmail)
                    .trainerName(trainerName)
                    .transactionId(payment.getTransactionId())
                    .paymentMethod(payment.getPaymentMethod())
                    .status(displayStatus)
                    .paymentAt(payment.getPaymentAt())
                    .productPrice(payment.getProductPrice())
                    .productName(payment.getProductName())
                    .sessions(displaySessions)
                    .startDate(displayStartDate) // ⭐ 변경된 타입으로 할당 ⭐
                    .category(category)
                    .history(reservationHistory)
                    .totalCount(payment.getTotalCount())
                    .hasSalary(hasSalary)
                    .build();
        }
    }
}