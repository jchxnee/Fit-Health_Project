import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import TitleBar from '../../components/TitleBar';
import api from '../../api/axios';
import SelectCourse from '../../components/CoachMatching/SelectCourse';
import ReservationCalendar from '../../components/CoachMatching/ReservationCalendar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { toast } from 'react-toastify';
import { paymentService } from '../../api/payment';

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
  const { user } = useUserStore();
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseQuantity, setCourseQuantity] = useState(3);
  const [finalPrice, setFinalPrice] = useState(0); // 할인 적용된 최종 금액
  const navigate = useNavigate();
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
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (!user?.email || !id) return;

    const fetchCoachData = async () => {
      try {
        const { data } = await api.get(`/api/trainer/request/${id}`);
        console.log('API 응답:', data);
        setTrainer(data);
      } catch (error) {
        console.error('트레이너 정보 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [user?.email, id]);

  if (loading) {
    return <PageWrapper>로딩 중...</PageWrapper>;
  }
  if (!trainer) {
    return <PageWrapper>트레이너 정보를 찾을 수 없습니다.</PageWrapper>;
  }

  const handleQuantityChange = (delta) => {
    setCourseQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleRequest = async () => {
    console.log('handleRequest 시작됨');

    if (!selectedDate || !selectedTime) {
      toast.warning('신청하실 날짜와 시간을 선택해주세요.');
      return;
    }

    const confirmed = window.confirm(
      `정말로 아래 내용으로 신청하시겠습니까?\n\n날짜: ${selectedDate}\n시간: ${selectedTime}`
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      const data = {
        userEmail: user.email,
        trainerEmail: trainer.trainerEmail,
        totalPrice: finalPrice,
        productName: trainer.majorName,
        totalCount: courseQuantity,
        firstReservation: selectedDate + 'T' + selectedTime,
      };

      console.log(data);
      const response = await paymentService.insertPayment(data);
      console.log('신청 처리 결과:', response);

      toast.success('결제를 진행해주세요!');
      navigate(`/paymentPage/${response}`);
    } catch (error) {
      console.error('결제 에러:', error);
      toast.error('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageWrapper>
        <TitleBar title={'신청'} />
        <ContentContainer>
          {trainer ? (
            <>
              <TrainerInfoWrapper>
                <SectionTitle>{trainer.majorName} 레슨</SectionTitle>
                <TrainerNameText>트레이너 명 : {trainer.trainerName} 트레이너</TrainerNameText>
              </TrainerInfoWrapper>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: theme.colors.gray[600] }}>트레이너 정보 로딩 중...</div>
          )}

          <SectionTitle>선택하신 코스</SectionTitle>
          <SelectCourse
            courseQuantity={courseQuantity}
            onQuantityChange={handleQuantityChange}
            oneTimePrice={trainer.oncePrice}
            trainer={trainer}
            onPriceChange={setFinalPrice}
          />

          <SectionTitle>날짜 및 시간 선택</SectionTitle>

          <ReservationCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
          />
        </ContentContainer>
        <SubmitButton onClick={handleRequest}>신청하기</SubmitButton>
      </PageWrapper>
    </>
  );
};

export default CoachMatching;
