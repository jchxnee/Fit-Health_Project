import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ReservationCalendar from '../../components/CoachMatching/ReservationCalendar';
import TitleBar from '../../components/TitleBar';
import theme from '../../styles/theme';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';
import useUserStore from '../../store/useUserStore';

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled.button`
  background-color: ${theme.colors.button};
  color: ${theme.colors.white};
  border: none;
  border-radius: 10px;
  padding: 18px 35px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 80%;
  max-width: 400px;
  &:hover {
    opacity: 90%;
  }
  &:disabled {
    background-color: ${theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const MessageText = styled.p`
  font-size: 1.1em;
  color: ${theme.colors.red};
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
`;

const LoadingText = styled.p`
  font-size: 1.1em;
  color: ${theme.colors.gray[600]};
  text-align: center;
  margin-top: 50px;
`;

const ErrorText = styled.p`
  font-size: 1.1em;
  color: ${theme.colors.red};
  text-align: center;
  margin-top: 50px;
`;

const NextReservation = () => {
  const navigate = useNavigate();

  const [user] = useUserStore();

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState(null);

  // ⭐️ API 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐️ API에서 가져올 데이터 상태
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null); // ⭐️ 현재 사용될 Payment ID

  // ⭐️ 현재 코칭 횟수 및 이용권 소진 여부
  const [currentCoachingCount, setCurrentCoachingCount] = useState(0);
  const [totalCoachingCount, setTotalCoachingCount] = useState(0);
  const [isVoucherExhausted, setIsVoucherExhausted] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. 사용자 이메일로 결제 목록 조회 - fetch 대신 axios 사용
        const paymentListResponse = await api.get(`${API_ENDPOINTS.PAYMENT.LIST}?userEmail=${user.email}`);
        const paymentListData = paymentListResponse.data; // axios 응답은 .data 속성에 실제 데이터가 있음
        setPayments(paymentListData);

        let currentPaymentId = null;
        if (paymentListData && paymentListData.length > 0) {
          currentPaymentId = paymentListData[0].paymentId;
          setSelectedPaymentId(currentPaymentId);
          setTotalCoachingCount(paymentListData[0].totalCount); // 2. 해당 paymentId에 대한 예약 목록 조회 - 이미 axios 사용 중

          const reservationListResponse = await api.get(
            `${API_ENDPOINTS.PAYMENT.RESERVATION_GET}?paymentId=${currentPaymentId}` // API_ENDPOINTS 수정 필요 (아래 참고)
          );
          const reservationListData = reservationListResponse.data; // axios 응답은 .data 속성에 실제 데이터가 있음
          setReservations(reservationListData); // ⭐️ 현재 코칭 횟수 계산 및 이용권 소진 여부 확인

          const completedReservations = reservationListData.filter(
            (res) => res.status === 'Y' // DTO 필드명 확인 (status 또는 STATUS)
          );
          setCurrentCoachingCount(completedReservations.length);
          setIsVoucherExhausted(completedReservations.length >= paymentListData[0].totalCount);
        } else {
          // 결제 내역이 없는 경우
          setIsVoucherExhausted(true);
          setTotalCoachingCount(0);
          setCurrentCoachingCount(0);
          setError('구매한 이용권이 없습니다. 새로운 이용권을 구매해주세요.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`데이터를 불러오는 데 실패했습니다: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user.email]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(null); // 날짜 변경 시 시간 선택 초기화
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedPaymentId) {
      alert('예약을 진행할 결제 정보가 없습니다. 이용권을 먼저 구매해주세요.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }
    if (isVoucherExhausted) {
      alert('이용권을 모두 소진하였습니다. 새로운 이용권을 구매해주세요.');
      return;
    }

    try {
      // ⭐️ 예약 생성 API 호출 (POST 요청)
      const reservationData = {
        paymentId: selectedPaymentId,
        selectDate: `${selectedDate} ${selectedTime}:00`, // 백엔드 형식에 맞춰 날짜 시간 결합
        // 필요한 경우 여기에 trainerId, userId 등의 추가 필드를 포함할 수 있습니다.
        // ReservationCreateDto.Create에 정의된 모든 필드를 여기에 포함시켜야 합니다.
        // 예: trainerId: user.trainerId,
        //     userId: user.id
      };

      // axios를 사용하고 있으므로, api.post 호출 시 두 번째 인자로 데이터를 직접 전달합니다.
      // axios는 Content-Type: application/json 헤더를 자동으로 설정하고,
      // 자바스크립트 객체를 JSON 문자열로 변환하여 보냅니다.
      const response = await api.post(API_ENDPOINTS.PAYMENT.RESERVATION_CREATE, reservationData); // ⭐️ POST 요청
      // 예약 성공 후, 예약 목록을 다시 불러와 상태 업데이트

      // axios는 기본적으로 응답 데이터가 response.data에 들어있고,
      // 네트워크 오류가 아니면 .ok 체크 대신 try-catch 블록으로 에러를 잡습니다.
      // status 코드가 2xx가 아니면 자동으로 에러를 throw 합니다.

      alert('예약이 성공적으로 신청되었습니다!');
      navigate('/matchingList'); // 성공 시 페이지 이동
    } catch (err) {
      console.error('Reservation submission error:', err);
      // axios 에러 처리: err.response.data에 서버에서 보낸 에러 메시지가 있을 수 있습니다.
      alert(`예약 신청 중 오류가 발생했습니다: ${err.response?.data?.message || err.message}`);
    }
  };

  // ⭐️ 예약 가능한 최소 날짜 계산 (오늘로부터 2일 뒤)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2); // 2일 뒤
    const year = minDate.getFullYear();
    const month = (minDate.getMonth() + 1).toString().padStart(2, '0');
    const day = minDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ⭐️ 예약된 시간대 목록을 생성 (selectedDate에 해당하는 예약만)
  const getReservedTimeSlots = () => {
    const reservedSlots = reservations
      .filter(
        // SELECT_DATE가 'YYYY-MM-DD HH:MM:SS' 형식이라고 가정
        (res) => res.status === 'Y' && res.selectDate && res.selectDate.startsWith(selectedDate)
      )
      .map((res) => {
        // SELECT_DATE에서 시간만 추출 (예: '2025-06-29 09:00:00' -> '09:00')
        return res.selectDate.substring(11, 16);
      });
    return reservedSlots;
  };

  const minBookingDate = getMinDate();
  const reservedTimes = getReservedTimeSlots();

  if (isLoading) {
    return <LoadingText>데이터를 불러오는 중입니다...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <>
      <PageWrapper>
        <TitleBar title={'다음 회차예약'} />
      </PageWrapper>
      <ReservationCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}
        minDate={minBookingDate}
        reservedTimes={reservedTimes}
      />
      {isVoucherExhausted ? (
        <MessageText>
          이용권을 모두 소진하였습니다. (현재 {currentCoachingCount}회 / 총 {totalCoachingCount}회) 새로운 이용권을
          구매해주세요.
        </MessageText>
      ) : (
        <MessageText>
          현재 코칭 횟수: {currentCoachingCount}회 / 총 신청 횟수: {totalCoachingCount}회
        </MessageText>
      )}
      <SubmitButton onClick={handleSubmit} disabled={!selectedDate || !selectedTime || isVoucherExhausted}>
        신청하기
      </SubmitButton>
    </>
  );
};

export default NextReservation;
