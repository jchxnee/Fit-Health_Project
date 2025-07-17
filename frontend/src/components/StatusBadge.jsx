// StatusBadge.jsx

import React from 'react';
import styled from 'styled-components';
import { MdAccessTimeFilled } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
// theme을 사용하고 있다면 import 필요
// import theme from '../../styles/theme';

export const StatusBadge = ({ status }) => {
  const getIconAndText = (status) => {
    switch (status) {
      case 'Y':
        return { icon: <FaCheckCircle />, text: '정상', statusKey: 'completed' };

      // ⭐ 이 부분 추가: '사용 완료' 상태에 대한 처리 ⭐
      case '사용 완료':
        return { icon: <FaCheckCircle />, text: '사용 완료', statusKey: 'completed' };
      // '사용 완료'도 완료된 상태이므로 'completed' statusKey를 사용합니다.
      // 만약 '사용 중' 상태도 있다면 여기에 추가해 주세요 (예: '사용 중' -> 'in-progress')
      case '사용 중': // PaymentDetailModal에서 'Y'가 아닐 때 '사용 중'으로 반환할 수 있으므로 추가
        return { icon: <MdAccessTimeFilled />, text: '사용 중', statusKey: 'in-progress' };

      case '승인대기':
        return { icon: <MdAccessTimeFilled />, text: '승인대기', statusKey: 'waiting' };
      case '진행중':
        return { icon: <MdAccessTimeFilled />, text: '진행중', statusKey: 'in-progress' };
      case '완료됨':
        return { icon: <FaCheckCircle />, text: '완료됨', statusKey: 'completed' };
      case '취소됨':
        return { icon: <MdCancel />, text: '취소됨', statusKey: 'canceled' };
      default:
        // 'default' statusKey에 대한 배경색이 BadgeWrapper에 정의되어 있지 않아 문제 발생
        // 따라서, 알 수 없는 상태는 'canceled'처럼 회색으로 처리하거나, 별도의 'unknown' 케이스를 BadgeWrapper에 추가해야 합니다.
        // 여기서는 임시로 'canceled'와 같은 statusKey를 사용하거나, 'default'를 BadgeWrapper에 추가합니다.
        // 더 안전한 방법은 'default'에 대한 스타일을 BadgeWrapper에 추가하는 것입니다.
        return { icon: null, text: status || '알 수 없음', statusKey: 'canceled' }; // 혹은 'default'로 하고 BadgeWrapper에 default 스타일 추가
    }
  };

  const { icon, text, statusKey } = getIconAndText(status);
  return (
    <BadgeWrapper status={statusKey}>
      {icon} {text}
    </BadgeWrapper>
  );
};

export default StatusBadge;

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
      // ⭐ 추가 (필요시): 'default' 상태에 대한 배경색을 정의 ⭐
      default: // getIconAndText에서 statusKey가 'default'로 반환될 경우 대비
        return theme.colors.gray[300]; // 예를 들어 연한 회색
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
    font-size: ${({ theme }) => theme.fontSizes.sm};
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
