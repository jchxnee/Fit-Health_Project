import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import ReservationCalendar from '../../components/CoachMatching/ReservationCalendar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TitleBar from '../../components/TitleBar';
import theme from '../../styles/theme';

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

  const userInfo = {
    name: '이주찬',
    img: '../../assets/beta_user_img.png',
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState(null);

  const [trainerId, setTrainerId] = useState(1);
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [oneTimePrice, setOneTimePrice] = useState(0);

  useEffect(() => {
    const fetchTrainerInfo = async () => {
      const dbTrainersData = {
        1: { id: 1, name: '김성은', specialization: '헬스', pricePerSession: 50000 },
        2: { id: 2, name: '박트레이너', specialization: '필라테스', pricePerSession: 60000 },
      };
      setTimeout(() => {
        const fetchedInfo = dbTrainersData?.[trainerId];
        setTrainerInfo(fetchedInfo);
        if (fetchedInfo) {
          setOneTimePrice(fetchedInfo.pricePerSession);
        }
      }, 500);
    };

    if (trainerId) {
      fetchTrainerInfo();
    }
  }, [trainerId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // 신청하기 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      // 선택된 날짜와 시간이 있을 경우에만 페이지 이동
      navigate('/matchingList');
    }
    // disabled 상태일 때는 이 함수 자체가 호출되지 않거나, 호출되더라도 아무것도 하지 않습니다.
  };

  return (
    <>
      <Header user={userInfo} />
      <PageWrapper>
        <TitleBar title={'다음 회차예약'} />
      </PageWrapper>
      <ReservationCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}
      />
      {/* SubmitButton은 실제 button 태그로 유지하고 onClick 핸들러 추가 */}
      <SubmitButton onClick={handleSubmit} disabled={!selectedDate || !selectedTime}>
        신청하기
      </SubmitButton>
      <Footer />
    </>
  );
};

export default NextReservation;
