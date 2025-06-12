import { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  const userInfo = {
    name: '이주찬',
    img: '../../assets/beta_user_img.png',
  };

  // **** 여기를 수정합니다. ****
  // 로컬 시간대를 고려하여 현재 날짜를 YYYY-MM-DD 형식으로 가져오는 헬퍼 함수
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  // **************************

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
      <SubmitButton disabled={!selectedDate || !selectedTime}>신청하기</SubmitButton>
      <Footer />
    </>
  );
};

export default NextReservation;
