import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import ReservationCalendar from '../../components/CoachMatching/ReservationCalendar';
import TitleBar from '../../components/TitleBar';
import theme from '../../styles/theme';
import { reservationService } from '../../api/reservation';
import api from '../../api/axios';
import { toast } from 'react-toastify';

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

const NextReservation = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation();

  const lessonData = location.state?.currentLesson;
  const [trainerNo, setTrainerNo] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    console.log('lessonData:', lessonData); // 구조 확인
    console.log('lessonData.trainerNo:', lessonData?.trainerNo); // 실제 값 확인

    if (lessonData?.trainerNo) {
      setTrainerNo(lessonData.trainerNo);
    }

    if (lessonData?.paymentId) {
      setPaymentId(lessonData.paymentId);
    }
  }, [lessonData]);

  // 오늘로부터 2일 후 날짜 구하기
  const getTwoDaysLaterDateString = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // 이틀 후
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDate = getTwoDaysLaterDateString();

  const [selectedDate, setSelectedDate] = useState(minDate); // 초기값도 이틀 후로
  const [selectedTime, setSelectedTime] = useState(null);

  const [disabledDateTimes, setDisabledDateTimes] = useState([]);
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [oneTimePrice, setOneTimePrice] = useState(0);

  useEffect(() => {
    const fetchTrainerInfo = async () => {
      try {
        const res = await api.get(`/api/trainer/${trainerNo}`);
        const { data: disabledList } = await api.get(`/api/reservation/disabledate/${trainerNo}`);
        setTrainerInfo(res.data);
        setOneTimePrice(res.data.oncePrice); // 실제 필드명에 맞게 수정
        setDisabledDateTimes(disabledList.map((d) => new Date(d)));
      } catch (error) {
        setTrainerInfo(null);
        setOneTimePrice(0);
      }
    };

    if (trainerNo) {
      fetchTrainerInfo();
    }
  }, [trainerNo]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // 신청하기 버튼 클릭 핸들러
  const handleSubmit = async () => {
    if (selectedDate && selectedTime) {
      try {
        // 날짜와 시간 합치기 (예: 2024-06-01T15:00:00)
        const selectDate = `${selectedDate}T${selectedTime}:00`;
        // paymentId는 실제로는 props/location 등에서 받아와야 함. 임시로 1번 사용
        await reservationService.createReservation({
          paymentId: paymentId, // 실제 paymentId로 교체 필요
          selectDate,
        });
        toast.success('다음 회차 예약이 완료되었습니다. 코치의 승인을 기다려주세요!');
        navigate('/matchingList');
      } catch (error) {
        toast.error('다음 회차 예약에 실패하였습니다.');
        alert(error.message);
      }
    }
    // disabled 상태일 때는 이 함수 자체가 호출되지 않거나, 호출되더라도 아무것도 하지 않습니다.
  };

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
        minDate={minDate}
        disabledDateTimes={disabledDateTimes}
      />
      {/* SubmitButton은 실제 button 태그로 유지하고 onClick 핸들러 추가 */}
      <SubmitButton onClick={handleSubmit} disabled={!selectedDate || !selectedTime}>
        신청하기
      </SubmitButton>
    </>
  );
};

export default NextReservation;
