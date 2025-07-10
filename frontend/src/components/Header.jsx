import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import headerIcon from '../assets/header_icon.png';
import { FaBell, FaChevronDown, FaChevronUp, FaSyncAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import basicProfile from '../../public/img/basicProfile.jpg';
import { toast } from 'react-toastify';
import api from '../api/axios';

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

// NotificationList 컴포넌트
function NotificationList({ notifications, onNotificationClick }) {
  if (!notifications || notifications.length === 0) {
    return (
      <NotificationContainer>
        <NotificationTitle>알림</NotificationTitle>
        <NoNotificationItem>새로운 알림이 없습니다.</NoNotificationItem>
      </NotificationContainer>
    );
  }

  return (
    <NotificationContainer>
      <NotificationTitle>알림</NotificationTitle>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.notificationNo}
          $isRead={notification.isRead === 'Y'} // 읽음 상태에 따라 스타일 적용
          onClick={() => onNotificationClick(notification)} // 클릭 시 핸들러 호출
        >
          <NotificationMessage>{notification.message}</NotificationMessage>
          <NotificationTime>{formatTimeAgo(notification.createdDate)}</NotificationTime>
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
}

// UserMenu 컴포넌트
function UserMenu({ onMenuItemClick }) {
  const logout = useUserStore((state) => state.logout);
  const updateUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  console.log(user.trainerNo);
  const handleLogout = () => {
    logout(); // 상태 초기화
    toast.success('로그아웃되었습니다.');
    navigate('/'); // 메인 페이지로 이동
  };

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

function Header({ user }) {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const bellIconRef = useRef(null);
  const profileWrapperRef = useRef(null);

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!user || !user.email) {
      // user.userEmail이 있는지 확인
      setUnreadNotificationCount(0);
      return;
    }
    try {
      const response = await api.get('/api/notifications/unread/count');
      setUnreadNotificationCount(response.data.count);
    } catch (error) {
      console.error('읽지 않은 알림 개수를 가져오는 데 실패했습니다:', error);
    }
  }, [user]);

  const fetchAllNotifications = useCallback(async () => {
    console.log('fetchAllNotifications 호출됨!');
    if (!user || !user.email) {
      console.log('User 또는 user.userEmail 없음, 알림 가져오기 중단.');
      setNotifications([]);
      return;
    }
    try {
      console.log('API 호출 시작: /api/notifications');
      const response = await api.get('/api/notifications');
      console.log('API 응답 데이터:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('알림 목록을 가져오는 데 실패했습니다:', error);
      toast.error('알림 목록을 가져오는 데 실패했습니다.');
    }
  }, [user]);

  useEffect(() => {
    let intervalId;
    if (user && user.email) {
      // user.userEmail이 유효한 경우에만 알림 관련 로직 실행
      fetchUnreadNotificationCount();
      intervalId = setInterval(fetchUnreadNotificationCount, 30000); // 30초마다 폴링
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
    console.log('종 아이콘 클릭!');
    setShowNotification((prev) => !prev);
    setShowUserMenu(false);

    if (!showNotification) {
      // 알림 모달이 열릴 때만 목록을 다시 가져옴
      await fetchAllNotifications();
    }
  };

  const onNotificationItemClick = async (notification) => {
    try {
      if (notification.isRead === 'N') {
        await api.post(`/api/notifications/${notification.notificationNo}/read`);
        fetchUnreadNotificationCount(); // 읽음 처리 후 개수 갱신
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
        // 추가된 알림 타입 핸들링 (goPayment와 goRefund에서 추가된 알림)
        case 'PT_PAYMENT_COMPLETED': // 유저가 결제 완료 시 트레이너에게 가는 알림
          navigate(`/coachmatchingList`); // 트레이너의 코칭 내역으로 이동
          break;
        case 'PT_REFUND_REQUEST': // 유저가 환불 요청 시 트레이너에게 가는 알림
          navigate(`/coachmatchingList`); // 트레이너의 코칭 내역으로 이동 또는 환불 관리 페이지
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
            <NavItem to="/exercise">추천 운동</NavItem>
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
                <NotificationList notifications={notifications} onNotificationClick={onNotificationItemClick} />
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
  z-index: ${({ theme }) => theme.zIndices.sticky};
  position: sticky;
  top: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  a,
  button {
    outline: none;
  }
`;

const HeaderContent = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
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
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[700]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RedDot = styled.div`
  position: absolute;
  top: -5px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: bold;
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
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;

const NotificationListContainer = styled.div`
  position: absolute;
  top: 50px;
  right: -10px;
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
`;

const NotificationContainer = styled.div`
  width: 292px;
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  text-align: start;

  max-height: 260px;
  overflow-y: auto;
`;

const NotificationTitle = styled.div`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  /* 스크롤 시 타이틀이 상단에 고정되도록 */
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 1; /* 알림 항목 위에 표시 */
`;

const NotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['4']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['100']};
  cursor: pointer;
  background-color: ${(props) => (props.$isRead ? props.theme.colors.white : props.theme.colors.gray[50])};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NoNotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
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

  button {
    outline: none;
  }
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
`;

export default Header;
