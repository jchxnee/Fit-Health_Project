import React, { useState } from 'react'; // useState import
import styled from 'styled-components'; // css import
import headerIcon from '../assets/header_icon.png';
import { FaBell, FaChevronDown, FaChevronUp, FaSyncAlt } from 'react-icons/fa'; // FaChevronDown, FaChevronUp import

// NotificationList 컴포넌트 (제공된 코드)
function NotificationList() {
  const notifications = [
    { message: '김현아 코치님께서 코칭 승인하셨습니다. 결제를 진행해주세요.', time: '2분 전' },
    { message: '전진영 코치님의 수업 결제가 완료되었습니다.', time: '2시간 전' },
    { message: '이주찬 코치님의 수업이 하루 남았습니다.', time: '3일 전' },
    { message: '황인태 코치님의 수업이 종료되었습니다. 리뷰를 남겨주세요.', time: '1달 전' },
  ];

  return (
    <NotificationContainer>
      <NotificationTitle>알림</NotificationTitle>
      {notifications.map((notification, index) => (
        <NotificationItem key={index}>
          <NotificationMessage>{notification.message}</NotificationMessage>
          <NotificationTime>{notification.time}</NotificationTime>
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
}

// UserMenu 컴포넌트 (제공된 코드)
function UserMenu() {
  const menuItems = [
    { name: '마이페이지', action: () => console.log('마이페이지 클릭') },
    { name: '신청 내역', action: () => console.log('신청 내역 클릭') },
    {
      name: '핏코치 등록',
      icon: <StyledFaSyncAlt />,
      action: () => console.log('핏코치 등록 클릭'),
    },
    { name: '로그아웃', action: () => console.log('로그아웃 클릭') },
  ];

  return (
    <UserMenuContainer>
      {menuItems.map((item) => (
        <UserMenuItem key={item.name} onClick={item.action}>
          {item.name}
          {item.icon && item.icon}
        </UserMenuItem>
      ))}
    </UserMenuContainer>
  );
}

function Header({ user }) {
  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 더미 알림 상태 (실제로는 API에서 받아올 알림 데이터의 존재 여부에 따라 결정)
  const hasNotifications = true; // 알림이 있다면 true, 없다면 false

  const handleNotificationClick = () => {
    setShowNotification((prev) => !prev);
    setShowUserMenu(false); // 다른 모달 닫기
  };

  const handleUserMenuClick = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotification(false); // 다른 모달 닫기
  };

  return (
    <HeaderComponent>
      <HeaderContent>
        <HeaderLeft>
          <HeaderIcon src={headerIcon} alt="icon" />
          <HeaderNavLeft>
            <span>핏코치 매칭</span>
            <span>추천 운동</span>
            <span>커뮤니티</span>
            <span>공지사항</span>
          </HeaderNavLeft>
        </HeaderLeft>
        {user !== null ? (
          <HeaderRight>
            <HeaderNavRight>
              <NotificationWrapper onClick={handleNotificationClick}>
                <FaBell />
                {hasNotifications && <RedDot />} {/* 알림이 있을 경우 빨간 점 표시 */}
              </NotificationWrapper>
              <span>채팅</span>
              <ProfileWrapper onClick={handleUserMenuClick}>
                <ProfileImg src={user.img} alt="profileIcon" />
                <span>{user.name}님</span>
                {showUserMenu ? <FaChevronUp size="14px" /> : <FaChevronDown size="14px" />}
              </ProfileWrapper>
            </HeaderNavRight>
            {showNotification && (
              <NotificationListContainer>
                <NotificationList />
              </NotificationListContainer>
            )}
            {showUserMenu && (
              <UserMenuContainerWrapper>
                <UserMenu />
              </UserMenuContainerWrapper>
            )}
          </HeaderRight>
        ) : (
          <HeaderRight>로그인/회원가입</HeaderRight>
        )}
      </HeaderContent>
    </HeaderComponent>
  );
}

const HeaderComponent = styled.header`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  position: sticky;
  top: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 헤더 그림자 추가 */
`;

const HeaderContent = styled.div`
  width: ${({ theme }) => theme.width.lg}; /* 1008px */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* 자식 모달의 위치 기준 */
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[10]};
`;

const HeaderIcon = styled.img`
  width: 124px;
  height: ${({ theme }) => theme.spacing[6]};
`;

const HeaderNavLeft = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};

  span {
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.button};
    }
  }
`;

const HeaderRight = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative; /* 알림 및 유저 메뉴 모달의 위치 기준 */
`;

const HeaderNavRight = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  align-items: center;

  span {
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.button};
    }
  }
`;

const NotificationWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xl}; /* 아이콘 크기 조정 */
  color: ${({ theme }) => theme.colors.gray[700]}; /* 아이콘 색상 조정 */

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RedDot = styled.div`
  position: absolute;
  top: 0px; /* 알림 아이콘 위치에 맞게 조정 */
  right: -2px; /* 알림 아이콘 위치에 맞게 조정 */
  width: 8px;
  height: 8px;
  background-color: #ff4d4f; /* 빨간색 */
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.white}; /* 흰색 테두리 */
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;

  & > svg {
    /* Chevron 아이콘 스타일 */
    margin-left: ${({ theme }) => theme.spacing[1]};
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;

// 알림 목록 모달 스타일
const NotificationListContainer = styled.div`
  position: absolute;
  top: 50px; /* 헤더 높이 + 여백 */
  right: -10px; /* 알림 아이콘에 맞춰서 조정 */
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  /* 애니메이션 추가 */
  opacity: 0;
  transform: translateY(-10px);
  animation: fadeInDown 0.3s forwards;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 사용자 메뉴 모달 스타일
const UserMenuContainerWrapper = styled.div`
  position: absolute;
  top: 50px; /* 헤더 높이 + 여백 */
  right: 0; /* 사용자 이름에 맞춰서 조정 */
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  /* 애니메이션 추가 */
  opacity: 0;
  transform: translateY(-10px);
  animation: fadeInDown 0.3s forwards;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 제공된 NotificationList의 스타일 컴포넌트 이름 변경 (이름 충돌 방지)
const NotificationContainer = styled.div`
  width: 292px;
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  text-align: start;
`;

const NotificationTitle = styled.div`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
`;

const NotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['2']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  &:last-child {
    border-bottom: none;
  }
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const NotificationMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[0.5]};
`;

const NotificationTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

// 제공된 UserMenu의 스타일 컴포넌트 이름 변경 (이름 충돌 방지)
const StyledFaSyncAlt = styled(FaSyncAlt)`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const UserMenuContainer = styled.div`
  width: 150px;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const UserMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]}; /* padding 조정 */
  width: 100%; /* 너비 100%로 설정하여 hover 영역 넓히기 */
  box-sizing: border-box; /* padding이 너비에 포함되도록 */
  transition: background-color 0.2s ease-in-out; /* hover 트랜지션 추가 */

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]}; /* hover 시 배경색 변경 */
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default Header;
