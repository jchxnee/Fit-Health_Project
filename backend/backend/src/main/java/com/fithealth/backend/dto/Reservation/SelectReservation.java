// src/main/java/com/fithealth/backend/dto/Reservation/SelectReservation.java

package com.fithealth.backend.dto.Reservation;

import com.fithealth.backend.entity.Reservation; // Reservation 엔티티 임포트
import com.fithealth.backend.enums.CommonEnums; // CommonEnums 임포트

import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter; // 날짜 포맷팅을 위해 임포트

public class SelectReservation {

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {

        private Long reservationNo;
        private String selectDate;
        private String status;
        private String rejectComment;
        private String createdDate;

        private Long paymentId;
        private String productName;

        public static Response fromEntity(Reservation reservation) {
            String formattedSelectDate = null;
            if (reservation.getSelectDate() != null) {
                formattedSelectDate = reservation.getSelectDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            }

            String formattedCreatedDate = null;
            if (reservation.getCreatedDate() != null) {
                formattedCreatedDate = reservation.getCreatedDate().toLocalDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }

            return Response.builder()
                    .reservationNo(reservation.getReservationNo())
                    .selectDate(formattedSelectDate)
                    .status(reservation.getStatus() != null ? reservation.getStatus().name() : null)
                    .rejectComment(reservation.getRejectComment())
                    .createdDate(formattedCreatedDate)
                    .paymentId(reservation.getPayment() != null ? reservation.getPayment().getPaymentId() : null)
                    .productName(reservation.getPayment() != null ? reservation.getPayment().getProductName() : null)
                    .build();
        }
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RefundResponse {

        private LocalDateTime selectDate;
        private CommonEnums.Status status;

        public static RefundResponse fromEntity(Reservation reservation) {
            return RefundResponse.builder()
                    .selectDate(reservation.getSelectDate())
                    .status(reservation.getStatus())
                    .build();
        }
    }

    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AbleReservationResponse {

        private LocalDateTime selectDate;

        public static AbleReservationResponse fromEntity(Reservation reservation) {
            return AbleReservationResponse.builder()
                    .selectDate(reservation.getSelectDate())
                    .build();
        }
    }
}