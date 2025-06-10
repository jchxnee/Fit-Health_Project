import React from 'react'
import styled from 'styled-components';
import { MdAccessTimeFilled } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export const StatusBadge = ({ status }) => {
  const getIconAndText = (status) => {
    switch (status) {
      case '승인대기': return { icon: <MdAccessTimeFilled />, text: '승인대기', statusKey: 'waiting' };
      case '진행중': return { icon: <MdAccessTimeFilled />, text: '진행중', statusKey: 'in-progress' };
      case '완료됨': return { icon: <FaCheckCircle />, text: '완료됨', statusKey: 'completed' };
      case '취소됨': return { icon: <MdCancel />, text: '취소됨', statusKey: 'canceled' };
      default: return { icon: null, text: status, statusKey: 'default' };
    }
  };

  const { icon, text, statusKey } = getIconAndText(status);
return (
    <BadgeWrapper status={statusKey}>
      {icon} {text}
    </BadgeWrapper>
  );
};

export default StatusBadge

const BadgeWrapper = styled.div`
    background-color: ${({ status, theme }) => {
    switch (status) {
      case 'waiting':
        return theme.colors.danger;
      case 'in-progress':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.success;
      case 'canceled':
        return theme.colors.gray[400];
    }
  }};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xs}; 
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']}; 
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 1px;

  & > svg {
    font-size: ${({theme}) => theme.fontSizes.sm};
  }
`;

const StatusBadgeItem = ({ status, text, icon }) => {
  return (
    <BadgeWrapper status={status}>
      {icon} {text}
    </BadgeWrapper>
  );
};

const AllStatusBadges = () => {
  return (
    <>
      <StatusBadgeItem status="waiting" text="승인대기" icon={<MdAccessTimeFilled />} />
      <StatusBadgeItem status="in-progress" text="진행중" icon={<MdAccessTimeFilled />} />
      <StatusBadgeItem status="completed" text="완료됨" icon={<FaCheckCircle />} />
      <StatusBadgeItem status="canceled" text="취소됨" icon={<MdCancel />} />
    </>
  );
};