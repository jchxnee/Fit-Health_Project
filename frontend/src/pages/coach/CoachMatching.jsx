import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import TitleBar from '../../components/TitleBar';

import SelectCourse from '../../components/CoachMatching/SelectCourse';
import ReservationCalendar from '../../components/CoachMatching/ReservationCalendar';
import { Link } from 'react-router-dom'; // Link는 SubmitButton을 button으로 변경하여 더 이상 필요하지 않을 수 있습니다.

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${theme.colors.white};
  margin-top: 20px;
  margin-bottom: 100px;
`;

const ContentContainer = styled.div`
  width: 80%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.4em;
  color: ${theme.colors.black};
  margin-bottom: 15px;
  text-align: left;
`;

const TrainerInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 30px;
  border-bottom: 1px solid ${theme.colors.gray[400]};
  padding-bottom: 10px;
`;

const TrainerNameText = styled.p`
  font-size: 1.1em;
  color: ${theme.colors.gray[700]};
  font-weight: bold;
`;

const SubmitButton = styled.button`
  /* Link 대신 button으로 변경 */
  background-color: ${theme.colors.button};
  color: ${theme.colors.white};
  border: none;
  border-radius: 10px;
  padding: 18px 35px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  margin-top: 40px;
  width: 80%;
  outline: none;
  max-width: 400px;
  &:hover {
    opacity: 90%;
  }
  &:disabled {
    background-color: ${theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const CoachMatching = () => {
  const [courseQuantity, setCourseQuantity] = useState(4);

  // 로컬 시간대를 고려하여 현재 날짜를 YYYY-MM-DD 형식으로 가져오는 헬퍼 함수
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작
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

  const handleQuantityChange = (delta) => {
    setCourseQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // 신청하기 버튼 클릭 시 호출될 함수
  const handleRequest = () => {
    if (!selectedDate || !selectedTime) {
      alert('신청하실 날짜와 시간을 선택해주세요.');
      return;
    }

    const confirmed = window.confirm(
      `정말로 아래 내용으로 신청하시겠습니까?\n\n날짜: ${selectedDate}\n시간: ${selectedTime}`
    );

    if (confirmed) {
      // 확인 버튼을 눌렀을 경우, 여기에서 다음 로직 (예: 결제 페이지로 이동, API 호출 등)을 추가할 수 있습니다.
      // 현재 코드에서는 Link 컴포넌트를 사용하고 있었으므로, 여기서는 단순히 콘솔 로그를 남깁니다.
      // 실제 애플리케이션에서는 navigate('/paymentPage')와 같은 방식으로 페이지를 이동할 수 있습니다.
      console.log('신청이 확인되었습니다. 다음 단계로 진행합니다.');
      // 예시: navigate('/paymentPage');
    } else {
      console.log('신청이 취소되었습니다.');
    }
  };

  return (
    <>
      <PageWrapper>
        <TitleBar title={'신청'} />
        <ContentContainer>
          {trainerInfo ? (
            <>
              <TrainerInfoWrapper>
                <SectionTitle>{trainerInfo.specialization} 레슨</SectionTitle>
                <TrainerNameText>트레이너 명 : {trainerInfo.name} 트레이너</TrainerNameText>
              </TrainerInfoWrapper>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: theme.colors.gray[600] }}>트레이너 정보 로딩 중...</div>
          )}

          <SectionTitle>선택하신 코스</SectionTitle>
          <SelectCourse
            courseQuantity={courseQuantity}
            onQuantityChange={handleQuantityChange}
            oneTimePrice={oneTimePrice}
          />

          <SectionTitle>날짜 및 시간 선택</SectionTitle>

          <ReservationCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
          />
        </ContentContainer>
        {/* SubmitButton을 styled.button으로 변경하고 onClick 핸들러 추가 */}
        <SubmitButton onClick={handleRequest} disabled={!selectedDate || !selectedTime || courseQuantity === 0}>
          신청하기
        </SubmitButton>
      </PageWrapper>
    </>
  );
};

export default CoachMatching;
