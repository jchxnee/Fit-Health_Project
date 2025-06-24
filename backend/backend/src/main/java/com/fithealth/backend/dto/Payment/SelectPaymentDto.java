package com.fithealth.backend.dto.Payment;

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
            } else if (payment.getPaymentStatus() == CommonEnums.Status.C) {
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
                    .build();
        }
    }
}