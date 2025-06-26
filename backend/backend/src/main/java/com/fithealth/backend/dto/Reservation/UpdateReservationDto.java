package com.fithealth.backend.dto.Reservation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReservationDto {
    private Long reservationNo;
    private String status;
    private String rejectReason;
}
