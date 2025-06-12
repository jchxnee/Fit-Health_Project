import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// 스타일 컴포넌트들은 변경 없음
const TimeReservationText = styled.p`
  font-size: 0.95em;
  color: ${theme.colors.gray[600]};
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  line-height: 1.4;
  font-weight: 500;
`;

const DatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background-color: ${theme.colors.white};
  border-radius: 10px;
  align-items: center;
`;

const StyledDateInput = styled.input`
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 12px;
  padding: 10px 14px;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.black};
  background-color: ${theme.colors.white};
  outline: none;
  width: 160px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.gray[500]};
    background-color: ${theme.colors.gray[50]};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px ${theme.colors.primary}30;
    background-color: ${theme.colors.white};
  }

  &::placeholder {
    color: ${theme.colors.gray[400]};
    font-weight: ${theme.fontWeights.medium};
  }
`;

const StyledTimeInput = styled.input`
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 12px;
  padding: 10px 14px;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.black};
  background-color: ${theme.colors.white};
  outline: none;
  width: 150px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.gray[500]};
    background-color: ${theme.colors.gray[50]};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px ${theme.colors.primary}30;
    background-color: ${theme.colors.white};
  }

  &::placeholder {
    color: ${theme.colors.gray[400]};
    font-weight: ${theme.fontWeights.medium};
  }
`;

const HorizontalContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const CalendarContainerWrapper = styled.div`
  width: 100%;
  max-width: 380px;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: ${theme.colors.white};
  font-size: 0.95em;
  display: flex;
  flex-direction: column;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const MonthYearText = styled.span`
  font-size: 1.1em;
  font-weight: bold;
  color: ${theme.colors.black};
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2em;
  color: ${theme.colors.gray[600]};
  cursor: pointer;
  padding: 5px;
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const DayNames = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
`;

const DayHeader = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 8px 5px;
  color: ${(props) => (props.isWeekend ? theme.colors.red : theme.colors.gray[700])};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const CalendarDay = styled.button`
  padding: 8px 5px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? theme.colors.primary : 'transparent')};
  color: ${(props) =>
    props.isSelected
      ? theme.colors.white
      : props.isPlaceholder
        ? theme.colors.gray[400]
        : props.isWeekend
          ? theme.colors.red
          : theme.colors.black};
  border: none;
  transition: all 0.2s ease-in-out;
  font-size: 0.9em;
  outline: none;

  &:hover {
    background-color: ${(props) => !props.isPlaceholder && !props.isSelected && theme.colors.gray[100]};
    transform: ${(props) => !props.isPlaceholder && !props.isSelected && 'scale(1.03)'};
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const TimeSlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 250px;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: ${theme.colors.white};
`;

const TimeSlotButton = styled.button`
  background-color: ${(props) => (props.isSelected ? theme.colors.primary : theme.colors.gray[100])};
  color: ${(props) => (props.isSelected ? theme.colors.white : theme.colors.black)};
  border: 1px solid ${(props) => (props.isSelected ? theme.colors.primary : theme.colors.gray[300])};
  border-radius: 8px;
  padding: 12px 10px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
  transition: all 0.2s ease-in-out;
  outline: none;
  &:hover {
    background-color: ${(props) => !props.isSelected && theme.colors.gray[200]};
    transform: ${(props) => !props.isSelected && 'translateY(-2px)'};
  }
`;

const ReservationCalendar = ({ selectedDate, onDateChange, selectedTime, onTimeChange }) => {
  // currentDisplayDate를 selectedDate prop을 기반으로 초기화
  // selectedDate가 유효한 날짜 문자열이라면 그 날짜로 Date 객체 생성
  // 유효하지 않다면 (예: null) 현재 날짜로 초기화
  const [currentDisplayDate, setCurrentDisplayDate] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  useEffect(() => {
    // selectedDate prop이 변경될 때, 캘린더 표시 월을 해당 날짜로 업데이트
    // 이펙트 내부에서 new Date(selectedDate)를 사용하여 새 Date 객체를 생성하고,
    // currentDisplayDate가 현재 prop의 날짜와 다른 경우에만 업데이트하여 불필요한 렌더링 방지.
    // 주의: currentDisplayDate를 의존성 배열에서 제거해야 무한 루프를 막을 수 있습니다.
    if (selectedDate) {
      const newDateFromProp = new Date(selectedDate);
      // 현재 표시 중인 월/년도와 prop으로 받은 날짜의 월/년도가 다를 때만 업데이트
      if (
        newDateFromProp.getFullYear() !== currentDisplayDate.getFullYear() ||
        newDateFromProp.getMonth() !== currentDisplayDate.getMonth()
      ) {
        setCurrentDisplayDate(newDateFromProp);
      }
    } else {
      // selectedDate가 null/undefined가 되면 현재 월로 돌아오도록 처리
      // 이 부분은 필요에 따라 제거하거나 다른 로직으로 변경할 수 있습니다.
      const today = new Date();
      if (
        today.getFullYear() !== currentDisplayDate.getFullYear() ||
        today.getMonth() !== currentDisplayDate.getMonth()
      ) {
        setCurrentDisplayDate(today);
      }
    }
  }, [selectedDate]); // **currentDisplayDate를 의존성 배열에서 제거했습니다!**

  const getCalendarDays = (year, month) => {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0:일, 1:월, ..., 6:토
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    // 이전 달의 플레이스홀더 날짜
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', isPlaceholder: true });
    }

    // 현재 달의 날짜
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ day: i, isPlaceholder: false, date: date });
    }

    // 다음 달의 플레이스홀더 날짜 (총 6주, 42칸을 채우기 위함)
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: '', isPlaceholder: true });
    }

    return days;
  };

  const year = currentDisplayDate.getFullYear();
  const month = currentDisplayDate.getMonth(); // getMonth()는 0부터 시작

  const calendarDays = getCalendarDays(year, month);

  const goToPreviousMonth = () => {
    setCurrentDisplayDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDisplayDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'];

  return (
    <>
      <TimeReservationText>P.T 시간(핏코치의 이동시간 포함 1시간 30분 단위로 예약 가능)</TimeReservationText>
      <DatePickerContainer>
        <StyledDateInput type="date" value={selectedDate} onChange={onDateChange} />
        <StyledTimeInput type="time" value={selectedTime || ''} onChange={onTimeChange} />
      </DatePickerContainer>

      <HorizontalContainer>
        <CalendarContainerWrapper>
          <CalendarHeader>
            <NavButton onClick={goToPreviousMonth}>
              <FaChevronLeft />
            </NavButton>
            <MonthYearText>
              {currentDisplayDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </MonthYearText>
            <NavButton onClick={goToNextMonth}>
              <FaChevronRight />
            </NavButton>
          </CalendarHeader>
          <DayNames>
            {dayNames.map((day, index) => (
              <DayHeader key={day} isWeekend={index === 0 || index === 6}>
                {day}
              </DayHeader>
            ))}
          </DayNames>
          <CalendarGrid>
            {calendarDays.map((dayInfo, index) => {
              const formattedDayInfoDate = dayInfo.date
                ? `${dayInfo.date.getFullYear()}-${(dayInfo.date.getMonth() + 1).toString().padStart(2, '0')}-${dayInfo.date.getDate().toString().padStart(2, '0')}`
                : null;

              const isSelected = !dayInfo.isPlaceholder && formattedDayInfoDate === selectedDate;

              const isWeekend = dayInfo.date && (dayInfo.date.getDay() === 0 || dayInfo.date.getDay() === 6);
              return (
                <CalendarDay
                  key={index}
                  isPlaceholder={dayInfo.isPlaceholder}
                  isSelected={isSelected}
                  isWeekend={isWeekend}
                  onClick={
                    dayInfo.isPlaceholder
                      ? null
                      : () => {
                          const year = dayInfo.date.getFullYear();
                          const month = (dayInfo.date.getMonth() + 1).toString().padStart(2, '0');
                          const day = dayInfo.date.getDate().toString().padStart(2, '0');
                          onDateChange({ target: { value: `${year}-${month}-${day}` } });
                        }
                  }
                  disabled={dayInfo.isPlaceholder}
                >
                  {dayInfo.day}
                </CalendarDay>
              );
            })}
          </CalendarGrid>
        </CalendarContainerWrapper>

        <TimeSlotsContainer>
          {timeSlots.map((time) => (
            <TimeSlotButton
              key={time}
              isSelected={time === selectedTime}
              onClick={() => onTimeChange({ target: { value: time } })}
            >
              {time}
            </TimeSlotButton>
          ))}
        </TimeSlotsContainer>
      </HorizontalContainer>
    </>
  );
};

export default ReservationCalendar;
