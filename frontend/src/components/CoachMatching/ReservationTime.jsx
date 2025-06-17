import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const TimeSlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* 최소 너비 조정 */
  gap: 10px;
  width: 100%;
  max-width: 400px; /* 캘린더와 동일하게 너비 맞춤 */
  margin: 20px auto;
  padding: 20px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: ${theme.colors.white};
`;

const TimeSlotButton = styled.button`
  background-color: ${(props) => (props.isSelected ? theme.colors.primary : theme.colors.gray100)};
  color: ${(props) => (props.isSelected ? theme.colors.white : theme.colors.black)};
  border: 1px solid ${(props) => (props.isSelected ? theme.colors.primary : theme.colors.gray300)}; /* 선택 시 테두리 변경 */
  border-radius: 8px; /* 버튼 둥글게 */
  padding: 12px 15px; /* 패딩 증가 */
  cursor: pointer;
  font-size: 1em; /* 글자 크기 조정 */
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => !props.isSelected && theme.colors.gray200};
    transform: ${(props) => !props.isSelected && 'translateY(-2px)'};
    box-shadow: ${(props) => !props.isSelected && '0 2px 5px rgba(0,0,0,0.1)'};
  }
`;

const ReservationTime = ({ selectedTime, onTimeChange }) => {
  const availableTimeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'];

  return (
    <TimeSlotsContainer>
      {availableTimeSlots.map((time) => (
        <TimeSlotButton key={time} isSelected={time === selectedTime} onClick={() => onTimeChange(time)}>
          {time}
        </TimeSlotButton>
      ))}
    </TimeSlotsContainer>
  );
};

export default ReservationTime;
