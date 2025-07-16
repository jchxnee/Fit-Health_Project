import React, { useState, useEffect, useRef, useCallback } from 'react'; // useRef, useEffect, useCallback import 추가
import styled from 'styled-components'; // css import
import headerIcon from '../assets/header_icon.png';
import { FaBell, FaChevronDown, FaChevronUp, FaSyncAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import basicProfile from '../../public/img/basicProfile.jpg';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { API_ENDPOINTS } from '../api/config';

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
          $isRead={notification.isRead === 'Y'}
          onClick={() => onNotificationClick(notification)}
        >
          {' '}
          {/* 여기서 사용 */}
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
  const { user } = useUserStore(); // user 정보를 useUserStore에서 가져옴
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]); // 알림 목록 상태
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); // 읽지 않은 알림 개수 상태

  // 알림 모달과 유저 메뉴 모달을 참조할 ref 생성
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const bellIconRef = useRef(null); // 알림 아이콘 ref
  const profileWrapperRef = useRef(null); // 프로필 래퍼 ref

  // 읽지 않은 알림 개수를 가져오는 함수
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

  // 모든 알림을 가져오는 함수
  const fetchAllNotifications = useCallback(async () => {
    console.log('fetchAllNotifications 호출됨!');
    if (!user || !user.email) {
      console.log('User 또는 user.email 없음, 알림 가져오기 중단.');
      setNotifications([]);
      return;
    }
    try {
      console.log('API 호출 시작: /api/notifications');
      const response = await api.get(`/api/notifications?userEmail=${user.email}`);
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
          navigate(`/chatpage`);
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
    setShowNotification(false); // 다른 모달 닫기
  };

  // UserMenu 내의 아이템을 클릭했을 때 호출될 함수
  const handleUserMenuItemClick = () => {
    setShowUserMenu(false); // UserMenu 닫기
  };

  // 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 알림 모달 외부 클릭 감지
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        bellIconRef.current && // 벨 아이콘이 클릭된 것이 아니라면
        !bellIconRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
      // 유저 메뉴 모달 외부 클릭 감지
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        profileWrapperRef.current && // 프로필 래퍼가 클릭된 것이 아니라면
        !profileWrapperRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행되도록 함

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
                {unreadNotificationCount > 0 && <RedDot>{unreadNotificationCount}</RedDot>}{' '}
                {/* 읽지 않은 알림이 있을 때만 표시 */}
              </NotificationWrapper>
              <NavItem to="/chatpage/:roomId">채팅</NavItem>
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
                <UserMenu onMenuItemClick={handleUserMenuItemClick} /> {/* prop 전달 */}
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 헤더 그림자 추가 */

  a,
  button {
    outline: none;
  }
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
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[700]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
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
  top: 40px;
  right: -130px;
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
`;

const NoNotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const NotificationMessage = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 3px;
  word-break: break-word;
  line-height: 1.3;
`;

const NotificationTime = styled.span`
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing['2']};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  white-space: nowrap;
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing['8']};
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
