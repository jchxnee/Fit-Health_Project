package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.enums.CommonEnums;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository {
    void save(Reservation reservation);
    List<Reservation> findByPaymentId(Long paymentId, CommonEnums.Status status);
    Reservation findByReservationNo(Long reservationNo);
    List<LocalDateTime> findDisableDate(Long trainerNo);
}
