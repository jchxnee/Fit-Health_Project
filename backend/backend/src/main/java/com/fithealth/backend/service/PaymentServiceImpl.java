package com.fithealth.backend.service;

import com.fithealth.backend.dto.Payment.CreatePaymentDto;
import com.fithealth.backend.dto.Payment.ResponsePaymentDto;
import com.fithealth.backend.dto.Payment.SelectPaymentDto;
import com.fithealth.backend.dto.Refund.RefundCreateDto;
import com.fithealth.backend.dto.Reservation.ReservationCreateDto;
import com.fithealth.backend.dto.Reservation.SelectReservation;
import com.fithealth.backend.dto.Reservation.UpdateReservationDto;
import com.fithealth.backend.dto.Salary.SalaryCreateDto;
import com.fithealth.backend.dto.Salary.SalaryCreateDto.Create;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Payment;
import com.fithealth.backend.entity.Refund;
import com.fithealth.backend.entity.Reservation;
import com.fithealth.backend.entity.Salary;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Status;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.PaymentRepository;
import com.fithealth.backend.repository.RefundRepository;
import com.fithealth.backend.repository.ReservationRepository;
import com.fithealth.backend.repository.SalaryRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements  PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final ReservationRepository reservationRepository;
    private final RefundRepository refundRepository;
    private final SalaryRepository salaryRepository;
    private final NotificationService notificationService;

    @Override
    public Long insertPayment(CreatePaymentDto.Create createDto) {
        // 1. 결제하는 유저 (알림을 보낼 대상은 아님)
        Member userMember = memberRepository.findByUserEmail(createDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("결제하는 회원을 찾을 수 없습니다: " + createDto.getUser_email()));

        // 2. 트레이너 (이 트레이너에게 알림을 보낼거임)
        Member trainerMember = memberRepository.findByUserEmail(createDto.getTrainer_email())
                .orElseThrow(() -> new EntityNotFoundException("트레이너 회원을 찾을 수 없습니다: " + createDto.getTrainer_email()));

        Payment payment = createDto.toEntity();
        payment.changeMember(userMember); // 결제한 유저
        payment.changeResponseMember(trainerMember); // 결제 대상 트레이너

        paymentRepository.save(payment);



        return payment.getPaymentId();
    }

    @Override
    public ResponsePaymentDto.Response findPayment(Long paymentId) {
        Payment payment = paymentRepository.findOne(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        return ResponsePaymentDto.Response.toDto(payment);
    }

    @Override
    @Transactional // 트랜잭션 관리를 위해 추가 (필수)
    public Long goPayment(ReservationCreateDto.Create createDto) {
        // 1. payment_id로 Payment 엔티티 조회
        Payment payment = paymentRepository.findOne(createDto.getPayment_id())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다. payment_id: " + createDto.getPayment_id()));

        // 2. 해당 payment_id로 이미 완료된 예약이 있는지 확인 (선택 사항, 비즈니스 로직에 따라)
        List<Reservation> isExists = reservationRepository.findByPaymentId(payment.getPaymentId(), CommonEnums.Status.Y);
        boolean isFirstReservation = isExists.isEmpty();

        // 3. Payment 엔티티의 상태 변경 및 트랜잭션 정보 업데이트
        payment.changeStatus(CommonEnums.Status.Y); // 결제 상태를 'Y' (완료)로 변경
        payment.putTransactionIdAndPaymentMethod(createDto.getTransaction_id(), createDto.getPayment_method());


        // 4. Reservation 엔티티 생성 및 Payment 연결
        Reservation reservation = createDto.toEntity(); // selectDate만 설정된 Reservation 객체 반환
        reservation.changePayment(payment); // Reservation에 Payment 객체 연결

        // 5. Reservation 저장
        boolean success = reservationRepository.save(reservation); // 이 save 메서드가 boolean을 반환한다면

        // 6. 알림 관련 로직 (기존과 동일)
        Member userMember = payment.getMember();
        Member trainerMember = payment.getResponseMember();

        if(success) {
            String message;
            String notificationType;
            if(isFirstReservation) {
                message = String.format("%s 회원님께서 PT 결제를 완료했습니다. PT 신청을 확인하고 승인해주세요.",
                        userMember.getUserName());
                notificationType = "PT_PAYMENT_COMPLETED";
            } else {
                message = String.format("%s 회원님께서 다음 PT 회차 신청을 완료했습니다. 신청을 확인하고 승인해주세요.",
                        userMember.getUserName());
                notificationType = "NEXT_RESERVATION_COMPLETED";
            }

            Long relatedIdForTrainer = reservation.getReservationNo();

            notificationService.createNotification(trainerMember, message, notificationType,
                    relatedIdForTrainer);
        } else {
            // save(reservation)이 false를 반환하는 경우, 실패로 간주
            throw new RuntimeException("예약 저장 실패: 알림을 생성할 수 없습니다.");
        }

        return reservation.getReservationNo();
    }

    @Override
    public List<SelectPaymentDto.Response> findPaymentList(String userEmail) {
        List<Payment> payments = paymentRepository.findPaymentList(userEmail);
        return payments.stream()
                .map(SelectPaymentDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<SelectPaymentDto.ResponseTrainer> findPaymentListByTrainer(String userEmail) {
        return paymentRepository.findPaymentListTrainer(userEmail).stream()
                .map(SelectPaymentDto.ResponseTrainer::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<SelectReservation.RefundResponse> findReservation(Long paymentId) {
        return reservationRepository.findByPaymentId(paymentId, CommonEnums.Status.Y).stream()
                .map(SelectReservation.RefundResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Long goRefund(RefundCreateDto.Create createDto) {
        Payment payment = paymentRepository.findOne(createDto.getPayment_id())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        payment.changeUseStatus(CommonEnums.UseStatus.C);

        Refund refund = createDto.toEntity();
        refund.changePayment(payment);

        boolean a = refundRepository.save(refund);
        if(a){
            String message = String.format("%s 님이 환불을 진행하였습니다. 확인해주세요", payment.getMember().getUserName());
            String notificationType = "REFUND_COMPLETED";
            notificationService.createSocialNotification(payment.getResponseMember(), message, notificationType);
        }
        return refund.getRefundId();
    }

    @Override
    public Long goSalary(SalaryCreateDto.Create createDto) {
        Payment payment = paymentRepository.findOne(createDto.getPayment_id())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보가 없습니다."));

        Salary salary = createDto.toEntity();
        salary.changePayment(payment);

        salaryRepository.save(salary);
        return salary.getSalaryNo();
    }

    @Override
    public void updateReservationStatus(UpdateReservationDto dto) {
        Reservation reservation = reservationRepository.findByReservationNo(dto.getReservationNo());

        if(reservation == null) {
            System.out.println("예약번호에 해당하는 예약이 없다 ㅋ , " + dto.getReservationNo());
            throw new NoSuchElementException("예약번호에 해당하는 예약이 없어서 오류남ㅋ , " + dto.getReservationNo());
        }

        CommonEnums.Status newStatus = CommonEnums.Status.valueOf(dto.getStatus());
        reservation.setStatus(newStatus);

        if (CommonEnums.Status.Y.equals(newStatus)) {
            // 승인 시 회차 증가
            Payment payment = reservation.getPayment();
            if (payment.getUsedCount() == null) payment.setUsedCount(0L);
            payment.setUsedCount(payment.getUsedCount() + 1);

            // (트레이너가 유저의 신청을 승인했을 때) ---
            // 알림 종류: 2. 트레이너가 유저의 신청을 승인했을 때(해당 유저가 로그인 시 알림)
            Member userMember = reservation.getPayment().getMember(); // 예약에 연결된 결제의 유저
            Member trainerMember = reservation.getPayment().getResponseMember(); // 예약에 연결된 결제의 트레이너

            String message = String.format("%s 코치님께서 PT 신청을 승인하셨습니다. 레슨이 진행됩니다.", trainerMember.getUserName()); // trainerMember.getName() 가정
            String notificationType = "PT_APPLICATION_APPROVED"; // 알림 종류를 나타내는 코드
            Long relatedId = reservation.getPayment().getPaymentId(); // 관련 ID (결제 ID 또는 예약 ID)

            notificationService.createNotification(userMember, message, notificationType, relatedId);

            // (3. 트레이너와의 PT코스가 끝났을 때) ---
            // 현재 회차 사용량(usedCount)이 총 회차(totalCount)와 같아지는지 확인
            if (payment.getUsedCount() != null && payment.getTotalCount() != null &&
                    payment.getUsedCount().equals(payment.getTotalCount())) {

                String completedMessage = String.format("%s 코치님과의 PT 코스가 모두 종료되었습니다. 코치님과의 수업은 어떠셨나요? 리뷰를 작성해주세요!",
                        trainerMember.getUserName() != null ? trainerMember.getUserName() : trainerMember.getUserEmail());
                String completedNotificationType = "PT_COURSE_COMPLETED";
                Long completedRelatedId = payment.getPaymentId();

                notificationService.createNotification(userMember, completedMessage, completedNotificationType, completedRelatedId);
            }

        }

        else if (CommonEnums.Status.N.equals(newStatus)){
            reservation.setRejectComment(dto.getRejectReason());
            // (트레이너가 유저의 신청을 거절했을 때) ---
            // 알림 종류: (추가) 트레이너가 유저의 신청을 거절했을 때(해당 유저가 로그인 시 알림)
            Member userMember = reservation.getPayment().getMember(); // 예약에 연결된 결제의 유저
            Member trainerMember = reservation.getPayment().getResponseMember(); // 예약에 연결된 결제의 트레이너

            String message = String.format("%s 코치님께서 PT 신청을 거절하셨습니다. 사유: %s", trainerMember.getUserName(), dto.getRejectReason()); // trainerMember.getName() 가정
            String notificationType = "PT_APPLICATION_REJECTED"; // 알림 종류를 나타내는 코드
            Long relatedId = reservation.getPayment().getPaymentId(); // 관련 ID (결제 ID 또는 예약 ID)

            notificationService.createNotification(userMember, message, notificationType, relatedId);
        } else {
            reservation.setRejectComment(null);
        }

        reservationRepository.save(reservation);

    }

    @Override
    @Transactional
    public Long insertReservation(ReservationCreateDto.Create createDto) {
        // DTO를 엔티티로 변환하고 저장하는 로직
        // 예시:
        // Reservation reservation = Reservation.builder()
        //     .paymentId(createDto.getPaymentId())
        //     .selectDate(LocalDateTime.parse(createDto.getSelectDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
        //     .status("Y") // 기본 상태 'Y' (승인 대기 또는 완료)
        //     // 기타 필드 설정 (필요하다면 trainerId, userId 등)
        //     .build();
        // Reservation savedReservation = reservationRepository.save(reservation);
        // return savedReservation.getReservationNo(); // 저장 후 ID 반환
        throw new UnsupportedOperationException("Not implemented yet"); // 실제 구현 필요
    }
}