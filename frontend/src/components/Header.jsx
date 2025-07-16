import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import headerIcon from '../assets/header_icon.png';
import { FaBell, FaChevronDown, FaChevronUp, FaSyncAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import basicProfile from '../../public/img/basicProfile.jpg';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { API_ENDPOINTS } from '../api/config';
import media from '../utils/media'; // media 헬퍼 함수 임포트

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

// 시간 포맷팅 유틸리티 함수
const formatTimeAgo = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}초 전`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}주 전`;
  const months = Math.floor(days / 30.44); // 평균 한 달
  if (months < 12) return `${months}달 전`;
  const years = Math.floor(months / 12);
  return `${years}년 전`;
};

// NotificationList 컴포넌트 (중복 제거 후 Header에서 props로 데이터 받도록 수정)
// onClearAllNotifications prop 추가
function NotificationList({ notifications, onNotificationClick, onClearAllNotifications }) {
  return (
    <NotificationContainer>
      <NotificationTitle>
        알림
        {/* 알림이 있든 없든 항상 '모두 지우기' 버튼을 표시하려면 여기에 렌더링 */}
        <AllClearButton onClick={onClearAllNotifications}>모두 지우기</AllClearButton>
      </NotificationTitle>
      {notifications && notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.notificationNo}
            $isRead={notification.isRead === 'Y'}
            onClick={() => onNotificationClick(notification)}
          >
            <NotificationMessage>{notification.message}</NotificationMessage>
            <NotificationTime>{formatTimeAgo(notification.createdDate)}</NotificationTime>
          </NotificationItem>
        ))
      ) : (
        // 알림이 없을 때만 이 메시지를 표시
        <NoNotificationItem>새로운 알림이 없습니다.</NoNotificationItem>
      )}
    </NotificationContainer>
  );
}

// UserMenu 컴포넌트
function UserMenu({ onMenuItemClick }) {
  const logout = useUserStore((state) => state.logout);
  const updateUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 상태 초기화
    toast.success('로그아웃되었습니다.');
    navigate('/'); // 메인 페이지로 이동
  };

  // 신청 내역으로 이동하면서 이메일을 쿼리 파라미터로 넘기는 함수
  const handleToggleGrade = async () => {
    if (!user) return;

    const newGrade = user.grade === 'U' ? 'C' : 'U';

    try {
      await updateUser({ grade: newGrade });

      toast.success(newGrade === 'C' ? '핏코치로 전환되었습니다.' : '일반 유저로 전환되었습니다.');
      onMenuItemClick(); // 메뉴 닫기
    } catch (error) {
      toast.error('전환 실패: ' + (error?.message || '알 수 없는 오류'));
    }
  };

  const menuItems = [
    { name: '마이페이지', to: '/mypage' },
    {
      name: user.grade === 'U' ? '신청 내역' : '코칭 내역',
      to: user.grade === 'U' ? '/matchingList' : '/coachmatchingList',
    },
    user?.trainerNo == null
      ? { name: '핏코치 등록', to: '/coachRegister', icon: <StyledFaSyncAlt /> }
      : {
          name: user.grade === 'U' ? '핏코치 전환' : '일반 유저 전환',
          action: handleToggleGrade,
          icon: <StyledFaSyncAlt />,
        },
    { name: '로그아웃', action: handleLogout },
  ];

  return (
    <UserMenuContainer>
      {menuItems.map((item) =>
        item.to ? (
          <NavItem key={item.name} to={item.to} onClick={onMenuItemClick}>
            <UserMenuItem>
              {item.name}
              {item.icon && item.icon}
            </UserMenuItem>
          </NavItem>
        ) : (
          <UserMenuItem
            key={item.name}
            onClick={() => {
              item.action();
              onMenuItemClick();
            }}
          >
            {item.name}
            {item.icon && item.icon}
          </UserMenuItem>
        )
      )}
    </UserMenuContainer>
  );
}

function Header() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const bellIconRef = useRef(null);
  const profileWrapperRef = useRef(null);

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!user || !user.email) {
      setUnreadNotificationCount(0);
      return;
    }
    try {
      const response = await api.get(`${API_ENDPOINTS.NOTIFICATION.UNREAD}?userEmail=${user.email}`);
      setUnreadNotificationCount(response.data.count);
    } catch (error) {
      console.error('읽지 않은 알림 개수를 가져오는 데 실패했습니다:', error);
      setUnreadNotificationCount(0);
    }
  }, [user]);

  const fetchAllNotifications = useCallback(async () => {
    if (!user || !user.email) {
      setNotifications([]);
      return;
    }
    try {
      const response = await api.get(`/api/notifications?userEmail=${user.email}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('알림 목록을 가져오는 데 실패했습니다:', error);
      toast.error('알림 목록을 가져오는 데 실패했습니다.');
    }
  }, [user]);

  useEffect(() => {
    let intervalId;
    if (user && user.email) {
      fetchUnreadNotificationCount();
      intervalId = setInterval(fetchUnreadNotificationCount, 30000);
    } else {
      setUnreadNotificationCount(0);
      setNotifications([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, fetchUnreadNotificationCount]);

  const handleNotificationClick = async () => {
    setShowNotification((prev) => !prev);
    setShowUserMenu(false);

    if (!showNotification) {
      await fetchAllNotifications();
    }
  };

  const onNotificationItemClick = async (notification) => {
    try {
      if (notification.isRead === 'N') {
        await api.post(`/api/notifications/${notification.notificationNo}/read`);
        fetchUnreadNotificationCount();
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.notificationNo === notification.notificationNo ? { ...notif, isRead: 'Y' } : notif
          )
        );
      }

      setShowNotification(false);

      switch (notification.notificationType) {
        case 'PT_APPLICATION_RECEIVED':
          navigate(`/coachmatchingList`);
          break;
        case 'PT_APPLICATION_APPROVED':
          navigate('/matchingList');
          break;
        case 'PT_APPLICATION_REJECTED':
          navigate('/matchingList');
          break;
        case 'PT_COURSE_COMPLETED':
          navigate('/reviewCreationPage', { state: { paymentId: notification.relatedId } });
          break;
        case 'PHONE_NULL':
          navigate('/myInfoPage');
          break;
        case 'REFUND_COMPLETED':
          navigate('/coachmatchingList');
          break;
        case 'REVIEW_SUBMITTED':
          navigate(`/coachReview/${notification.relatedId}`);
          break;
        case 'NEW_CHAT_MESSAGE':
          navigate(`/chat`);
          break;
        case 'NEW_COMMENT_ON_POST':
          navigate(`/communityDetailPage/${notification.relatedId}`);
          break;
        case 'PT_PAYMENT_COMPLETED':
          navigate(`/coachmatchingList`);
          break;
        case 'PT_REFUND_REQUEST':
          navigate(`/coachmatchingList`);
          break;
        case 'NEXT_RESERVATION_COMPLETED':
          navigate('/coachmatchingList');
          break;
        default:
          navigate('/mypage');
          break;
      }
    } catch (error) {
      console.error('알림 처리 중 오류 발생:', error);
      toast.error('알림 처리 중 오류가 발생했습니다.');
    }
  };

  // 모든 알림을 읽음 처리하는 함수 (수정된 부분)
  const handleClearAllNotifications = useCallback(async () => {
    if (!user || !user.email) {
      toast.error('사용자 정보가 없어 알림을 읽음 처리할 수 없습니다.');
      return;
    }
    try {
      // 현재 notifications 상태에서 읽지 않은 알림만 필터링합니다.
      const unreadNotifs = notifications.filter((notif) => notif.isRead === 'N');

      // 각 읽지 않은 알림에 대해 개별 읽음 처리 API를 호출합니다.
      // Promise.all을 사용하여 모든 요청이 완료될 때까지 기다립니다.
      const markAsReadPromises = unreadNotifs.map((notif) =>
        api.post(`/api/notifications/${notif.notificationNo}/read`)
      );

      await Promise.all(markAsReadPromises);

      // 모든 요청이 성공하면 프론트엔드 상태를 업데이트합니다.
      setNotifications(
        (prev) => prev.map((notif) => ({ ...notif, isRead: 'Y' })) // 모든 알림을 읽음으로 표시
      );
      setUnreadNotificationCount(0); // 읽지 않은 알림 개수를 0으로 설정
      toast.success('모든 알림을 읽음 처리했습니다.');
      setShowNotification(false); // 알림창 닫기
    } catch (error) {
      console.error('모든 알림을 읽음 처리하는 데 실패했습니다:', error);
      toast.error('모든 알림을 읽음 처리하는 데 실패했습니다.');
    }
  }, [user, notifications]); // notifications 상태를 의존성 배열에 추가

  const handleUserMenuClick = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotification(false);
  };

  const handleUserMenuItemClick = () => {
    setShowUserMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        bellIconRef.current &&
        !bellIconRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        profileWrapperRef.current &&
        !profileWrapperRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <HeaderComponent>
      <HeaderContent>
        <HeaderLeft>
          <NavItem to="/">
            <HeaderIcon src={headerIcon} alt="icon" />
          </NavItem>
          <HeaderNavLeft>
            <NavItem to="/coachList">핏코치 매칭</NavItem>
            <NavItem to="/exercise">AI 맞춤건강</NavItem>
            <NavItem to="/community">커뮤니티</NavItem>
            <NavItem to="/notice">공지사항</NavItem>
            <NavItem to="/productList">건강 상품</NavItem>
          </HeaderNavLeft>
        </HeaderLeft>
        {user !== null ? (
          <HeaderRight as="div">
            <HeaderNavRight>
              <NotificationWrapper onClick={handleNotificationClick} ref={bellIconRef}>
                <FaBell />
                {unreadNotificationCount > 0 && <RedDot>{unreadNotificationCount}</RedDot>}
              </NotificationWrapper>
              <NavItem to="/chat">채팅</NavItem>
              <ProfileWrapper onClick={handleUserMenuClick} ref={profileWrapperRef}>
                <ProfileImg
                  src={user.img ? `${CLOUDFRONT_URL}${user.img}?v=${Date.now()}` : basicProfile}
                  alt="profileIcon"
                />
                <span>{user.name}님</span>
                {showUserMenu ? <FaChevronUp size="14px" /> : <FaChevronDown size="14px" />}
              </ProfileWrapper>
            </HeaderNavRight>
            {showNotification && (
              <NotificationListContainer ref={notificationRef}>
                <NotificationList
                  notifications={notifications}
                  onNotificationClick={onNotificationItemClick}
                  onClearAllNotifications={handleClearAllNotifications} // 새로 추가된 prop
                />
              </NotificationListContainer>
            )}
            {showUserMenu && (
              <UserMenuContainerWrapper ref={userMenuRef}>
                <UserMenu onMenuItemClick={handleUserMenuItemClick} />
              </UserMenuContainerWrapper>
            )}
          </HeaderRight>
        ) : (
          <HeaderRight to="/login">로그인/회원가입</HeaderRight>
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
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  position: sticky;
  top: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  a,
  button {
    outline: none;
  }

  ${media.md`
    height: 50px;
  `}
  ${media.sm`
    height: 45px;
  `}
`;

const HeaderContent = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  ${media.lg`
    width: 95%;
  `}
  ${media.md`
    width: 95%;
    padding: 0 ${({ theme }) => theme.spacing[4]}; // 좌우 패딩 추가
  `}
  ${media.sm`
    width: 100%;
    padding: 0 ${({ theme }) => theme.spacing[3]}; // 좌우 패딩 추가
  `}
  ${media.xs`
    padding: 0 ${({ theme }) => theme.spacing[2]}; // 더 작은 화면
  `}
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[10]};

  ${media.md`
    gap: ${({ theme }) => theme.spacing[6]};
  `}
  ${media.sm`
    gap: ${({ theme }) => theme.spacing[3]}; // 모바일에서 간격 줄이기
  `}
`;

const HeaderIcon = styled.img`
  width: 124px;
  height: ${({ theme }) => theme.spacing[6]};

  ${media.md`
    width: 100px;
    height: ${({ theme }) => theme.spacing[5]};
  `}
  ${media.sm`
    width: 80px;
    height: ${({ theme }) => theme.spacing[4]};
  `}
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

  ${media.md`
    gap: ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
  ${media.sm`
    /* display: none; // 이 줄을 제거하여 메뉴가 사라지지 않도록 함 */
    gap: ${({ theme }) => theme.spacing[1]}; /* 간격 더 줄임 */
    font-size: ${({ theme }) => theme.fontSizes.xs}; /* 폰트 크기 더 줄임 */
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
    overflow-x: auto; /* 가로 스크롤 가능하게 함 (필요시) */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar { // 스크롤바 숨기기 (선택 사항)
      display: none;
    }
  `}
  ${media.xs` /* 더 작은 화면을 위한 추가 조정 */
    gap: ${({ theme }) => theme.spacing[0]};
    font-size: 10px; /* 더 작은 폰트 사이즈 */
    padding: 0 4px; /* 좌우 패딩도 조금 줄일 수 있음 */
  `}
`;

const NavItem = styled(Link)`
  outline: none;
`;

const HeaderRight = styled(Link)`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};

  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
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

  ${media.md`
    gap: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
  ${media.sm`
    gap: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
   ${media.xs` /* 더 작은 화면을 위한 추가 조정 */
    gap: ${({ theme }) => theme.spacing[0]};
    font-size: 10px; /* 더 작은 폰트 사이즈 */
    padding: 0 4px; /* 좌우 패딩도 조금 줄일 수 있음 */
  `}
`;

const NotificationWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[700]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const RedDot = styled.div`
  position: absolute;
  top: -7px;
  right: -6px;
  width: 16px;
  height: 16px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  ${media.sm`
    width: 14px;
    height: 14px;
    font-size: 8px;
    top: -5px;
    right: -5px;
  `}
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;

  & > svg {
    margin-left: ${({ theme }) => theme.spacing[1]};
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  ${media.sm`
    span {
        display: none; // 모바일에서 사용자 이름 숨기기
    }
    & > svg {
        margin-left: 0;
        font-size: 12px;
    }
  `}
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;

  ${media.md`
    width: 28px;
    height: 28px;
  `}
  ${media.sm`
    width: 24px;
    height: 24px;
  `}
`;

const NotificationListContainer = styled.div`
  position: absolute;
  top: 40px;
  right: -130px; // 기본 위치
  z-index: ${({ theme }) => theme.zIndices.sticky};
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

  ${media.md`
    right: -100px; // 중간 화면에서 위치 조정
    top: 35px;
  `}
  ${media.sm`
    right: auto; /* right 속성 해제 */
    left: 50%; /* 중앙 정렬을 위한 left 설정 */
    transform: translateX(-50%) translateY(-10px); /* X축 중앙 정렬 및 애니메이션 */
    top: 30px;
    width: calc(100vw - ${({ theme }) => theme.spacing[4]} * 2); // 화면 너비에 맞추기
    max-width: 300px; // 최대 너비 제한
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `}
`;

const UserMenuContainerWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
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

  ${media.md`
    top: 45px;
  `}
  ${media.sm`
    top: 40px;
    width: 140px; // 모바일에서 너비 조정
    right: ${({ theme }) => theme.spacing[2]}; // 오른쪽 여백
  `}
`;

const NotificationContainer = styled.div`
  width: 338px;
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: start;
  max-height: 260px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  ${media.sm`
    width: 100%; // 모바일에서 부모 너비 따르기
    max-height: 200px; // 모바일에서 최대 높이 줄이기
    border-radius: ${({ theme }) => theme.borderRadius.md};
  `}
`;

// AllClearButton 스타일 추가 및 수정
const AllClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    scale: 1.1;
  }

  ${media.sm`
    font-size: 10px;
  `}
`;

const NotificationTitle = styled.div`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.sm`
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
`;

const NotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['3']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  background-color: ${({ theme }) => theme.colors.white};
  min-height: ${({ theme }) => theme.spacing['18']};
  &:last-child {
    border-bottom: none;
  }
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  ${media.sm`
    padding: ${({ theme }) => theme.spacing[2]};
    min-height: ${({ theme }) => theme.spacing[12]};
    flex-direction: column; // 모바일에서 세로로 정렬
    align-items: flex-start;
  `}
`;

const NoNotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  ${media.sm`
    padding: ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
`;

const NotificationMessage = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 3px;
  word-break: break-word;
  line-height: 1.3;

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  `}
`;

const NotificationTime = styled.span`
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing['2']};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  white-space: nowrap;
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing['8']};

  ${media.sm`
    margin-left: 0; // 모바일에서는 메시지 아래로
    margin-top: 0;
    width: 100%; // 전체 너비 사용
    text-align: left; // 왼쪽 정렬
  `}
`;

const StyledFaSyncAlt = styled(FaSyncAlt)`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.gray[600]};

  ${media.sm`
    font-size: 12px;
    margin-left: 4px;
  `}
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

  button {
    outline: none;
  }

  ${media.sm`
    width: 130px;
    padding: ${({ theme }) => theme.spacing[3]} 0;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  `}
`;

const UserMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  `}
`;

export default Header;
