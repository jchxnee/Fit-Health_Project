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
import java.time.format.DateTimeFormatter;
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
        private String transactionId;
        private String paymentMethod;
        private String status;
        private LocalDateTime paymentAt;
        private Long productPrice;
        private String productName;
        private String sessions;
        private String startDate;
        private String category;
        private boolean hasReview;
        private boolean isRefund;

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
                // 예약 상태를 기반으로 '진행중' 판단 로직 추가
                if (completedSessionsCount < payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    displayStatus = "진행중";
                } else if (completedSessionsCount == payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    // 모든 세션을 사용했지만 useStatus가 아직 Y인 경우, 이 부분은 비즈니스 로직에 따라 '완료됨'
                    displayStatus = "완료됨";
                } else {
                    displayStatus = "알 수 없음"; // 그 외 케이스
                }
            }


            String displayStartDate = null;
            if (payment.getFirstReservation() != null) {
                displayStartDate = payment.getFirstReservation().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
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
                // 4회 상품: 3회까지 했을 때 환불 가능
                else if (totalCount == 4) {
                    if (completedSessionsCount == 3) {
                        isRefundable = true;
                    } else {
                        isRefundable = false;
                    }
                }
                // 6, 7, 8, 9회 상품: 5회까지 했을 때 환불 가능
                else if (totalCount >= 6 && totalCount <= 9) {
                    if (completedSessionsCount >= 5) {
                        isRefundable = true;
                    } else {
                        isRefundable = false;
                    }
                }
                // 11회 이상 상품: 10회까지 했을 때 환불 가능
                else if (totalCount >= 11) {
                    if (completedSessionsCount >= 10) {
                        isRefundable = true;
                    } else {
                        isRefundable = false;
                    }
                }
            }





            return Response.builder()
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
                    .startDate(displayStartDate)
                    .category(category)
                    .history(reservationHistory)
                    .hasReview(hasReview)
                    .isRefund(isRefundable)
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
        private String startDate;
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
                // 예약 상태를 기반으로 '진행중' 판단 로직 추가
                if (completedSessionsCount < payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    displayStatus = "진행중";
                } else if (completedSessionsCount == payment.getTotalCount() && payment.getUseStatus() == CommonEnums.UseStatus.Y) {
                    // 모든 세션을 사용했지만 useStatus가 아직 Y인 경우, 이 부분은 비즈니스 로직에 따라 '완료됨'
                    displayStatus = "완료됨";
                } else {
                    displayStatus = "알 수 없음"; // 그 외 케이스
                }
            }


            String displayStartDate = null;
            if (payment.getFirstReservation() != null) {
                displayStartDate = payment.getFirstReservation().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
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
                    .startDate(displayStartDate)
                    .category(category)
                    .history(reservationHistory)
                    .totalCount(payment.getTotalCount())
                    .hasSalary(hasSalary)
                    .build();
        }
    }
}