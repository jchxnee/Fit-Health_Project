// src/main/components/modal/HistoryModal.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import theme from '../../styles/theme';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  padding: ${theme.spacing[8]} ${theme.spacing[12]};
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: ${theme.width.md};
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  position: relative;

  @media (max-width: ${theme.width.sm}) {
    padding: ${theme.spacing[5]};
    width: ${theme.width.xs};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.colors.gray['200']};
  padding-bottom: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[5]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.gray['900']};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSizes['2xl']};
  cursor: pointer;
  color: ${theme.colors.gray['600']};

  &:hover {
    color: ${theme.colors.gray['900']};
  }
`;

const ModalBody = styled.div`
  display: flex;
  gap: ${theme.spacing[8]};
  width: 100%;

  @media (max-width: ${theme.width.md}) {
    flex-direction: column;
    gap: ${theme.spacing[5]};
  }
`;

const CalendarWrapper = styled.div`
  flex: 1;
  .react-calendar {
    border: 1px solid ${theme.colors.gray['300']};
    border-radius: ${theme.borderRadius.base};
    padding: ${theme.spacing[2]};
    width: 100%;
    box-shadow: none;
    font-family: 'Pretendard', sans-serif;
    background-color: ${theme.colors.white};
  }

  .react-calendar__navigation button {
    color: ${theme.colors.gray['700']};
    min-width: 44px;
    background: none;
    font-size: ${theme.fontSizes.lg};

    &:enabled:focus {
      background-color: ${theme.colors.gray['100']};
      border-radius: ${theme.borderRadius.sm};
    }
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: none !important;
    font-weight: ${theme.fontWeights.medium};
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.gray['700']};
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__month-view__days__day--weekend {
    color: ${theme.colors.danger};
  }

  .react-calendar__tile {
    padding: ${theme.spacing[2]} 0;
    text-align: center;
    border-radius: ${theme.borderRadius.sm};
    height: auto;
    min-height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.gray['800']};
    &:enabled:focus {
      background-color: ${theme.colors.gray['100']};
      border-radius: ${theme.borderRadius.sm};
    }
  }

  /* 오늘 날짜 색칠 제거 */
  .react-calendar__tile--now {
    background: transparent !important;
    color: inherit !important;
    font-weight: normal !important;
  }

  /* 선택된 날짜의 배경색을 투명하게 만듦 */
  /* session-day 클래스가 있는 경우에만 skyblue 배경을 가지도록 */
  .react-calendar__tile--active {
    background: transparent !important; /* 기본 파란색 배경을 제거 */
    color: ${theme.colors.gray['900']} !important;
    font-weight: ${theme.fontWeights.bold} !important;
    border-radius: 50%; /* 모양 유지를 위해 */
  }

  .react-calendar__tile.session-day {
    background-color: ${theme.colors.skyblue} !important;
    border-radius: 50%;
    color: ${theme.colors.gray['900']} !important;
    font-weight: ${theme.fontWeights.bold};
    width: 38px;
    height: 38px;
    line-height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 이전 달/다음 달 날짜 색상 투명하게 (보이지 않게) */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: transparent !important;
  }

  .react-calendar__year-view__months__month,
  .react-calendar__decade-view__years__year,
  .react-calendar__century-view__decades__decade {
    border-radius: ${theme.borderRadius.base};
    &:enabled:hover,
    &:enabled:focus {
      background-color: ${theme.colors.gray['100']};
    }
  }
`;

const HistoryListWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  max-height: 370px;
  overflow-y: auto;
  padding-right: ${theme.spacing[1]};

  &::-webkit-scrollbar {
    width: ${theme.spacing[2]};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.gray['300']};
    border-radius: ${theme.borderRadius.base};
  }

  &::-webkit-scrollbar-track {
    background-color: ${theme.colors.gray['100']};
  }
`;

const HistoryListItem = styled.div`
  background-color: ${({ theme, $isSessionDate }) =>
    $isSessionDate ? theme.colors.gray['200'] : theme.colors.gray['100']};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.base};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.gray['800']};
  display: flex;
  flex-direction: column; /* 세로로 정렬하도록 변경 */
  align-items: flex-start; /* 왼쪽 정렬 */
  box-shadow: ${theme.shadows.sm};
  transition: background-color 0.2s ease-in-out;
`;

const HistoryItemTopRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const HistoryDate = styled.span`
  font-weight: ${theme.fontWeights.medium};
  font-size: ${theme.fontSizes.base};
`;

const HistorySessionStatus = styled.span`
  color: ${theme.colors.gray['600']};
  font-size: ${theme.fontSizes.sm}; /* 좀 더 작게 */
`;

const RejectComment = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing[1]};
  margin-bottom: 0;
`;

const HistoryModal = ({ isOpen, onClose, coachName, history }) => {
  if (!isOpen) return null;

  const [activeDate, setActiveDate] = useState(new Date());

  // history 배열의 각 item.selectDate (yyyy-MM-dd)를 Date 객체로 변환
  const sessionDates = history
    .map((item) => {
      // ⭐ 변경된 부분: 시간 부분을 제거합니다.
      const datePart = item.selectDate.split(' ')[0]; // '2025-06-23 00:00' -> '2025-06-23'
      const [year, month, day] = datePart.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      // console.log(`Parsing "${item.selectDate}" to Date:`, dateObj); // 디버깅 로그는 필요 없으면 제거
      return dateObj;
    })
    .filter((date) => date instanceof Date && !isNaN(date.getTime()));

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isSessionDay = sessionDates.some((sessionDate) => isSameDay(sessionDate, date));
      return isSessionDay ? 'session-day' : null;
    }
    return null;
  };

  const formatDayNumber = (locale, date) => date.getDate();

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{coachName} 코치 이용 기록</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <CalendarWrapper>
            <Calendar
              value={activeDate}
              onChange={setActiveDate}
              tileClassName={tileClassName}
              formatDay={formatDayNumber}
              showNeighboringMonth={false}
            />
          </CalendarWrapper>
          <HistoryListWrapper>
            {history.length > 0 ? (
              history.map((item, index) => {
                // 이 부분도 캘린더 하이라이트 로직과 일관되게 날짜 부분만 파싱하도록 수정
                const datePartForHighlight = item.selectDate.split(' ')[0];
                const [year, month, day] = datePartForHighlight.split('-').map(Number);
                const safeItemDate = new Date(year, month - 1, day);

                const isItemSessionDate = sessionDates.some((sessionDate) => isSameDay(sessionDate, safeItemDate));

                return (
                  <HistoryListItem key={index} $isSessionDate={isItemSessionDate}>
                    <HistoryItemTopRow>
                      <HistoryDate>
                        {index + 1}회차: {item.selectDate.split(' ')[0]} {/* 리스트에서도 날짜만 표시 */}
                      </HistoryDate>
                    </HistoryItemTopRow>
                    {item.rejectComment && <RejectComment>거절 사유: {item.rejectComment}</RejectComment>}
                  </HistoryListItem>
                );
              })
            ) : (
              <p>이용 기록이 없습니다.</p>
            )}
          </HistoryListWrapper>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HistoryModal;
