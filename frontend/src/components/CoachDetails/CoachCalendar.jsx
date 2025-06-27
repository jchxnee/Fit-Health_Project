import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarStyles.css';
import CoachSubBar from './CoachSubBar';
import CoachMatchingList from './CoachMatchingList';
import styled from 'styled-components';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TitleBar from '../TitleBar';
import useUserStore from '../../store/useUserStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

moment.locale('ko');
const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group rbc-nav-arrows">
        <button type="button" onClick={() => onNavigate('PREV')}>
          &lt;
        </button>
        <button type="button" onClick={() => onNavigate('NEXT')}>
          &gt;
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-right-group">
        {/* CustomToolbar 내에서 CoachSubBar를 렌더링하여 캘린더/리스트 뷰 전환 버튼 제공 */}
        <CoachSubBar onView={onView} currentView={view} />
      </span>
    </div>
  );
};

function CoachCalendar() {
  // 초기 뷰를 'list'로 설정
  const [view, setView] = useState('list');
  const [currentDate, setCurrentDate] = useState(moment().toDate()); // 캘린더의 현재 날짜

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [matchingList, setMatchingList] = useState([]);

  // useCallback으로 fetchMatchingList를 감싸 의존성 배열 변경 시에만 함수가 재생성되도록 최적화
  const fetchMatchingList = useCallback(async () => {
    const userEmail = user?.email;

    if (!isAuthenticated || !userEmail) {
      toast.error('로그인이 필요하거나 사용자 이메일 정보를 찾을 수 없어 신청 내역을 불러올 수 없습니다.');
      navigate('/login');
      return;
    }
    try {
      // API_ENDPOINTS.PAYMENT.TRAINERLIST를 사용하여 API 요청
      const response = await api.get(API_ENDPOINTS.PAYMENT.TRAINERLIST, {
        params: {
          userEmail: userEmail,
        },
      });
      console.log('Fetching matching list:', response.data);
      setMatchingList(response.data);
    } catch (err) {
      console.error('신청 내역을 불러오는 중 오류 발생:', err);
      toast.error('신청 내역을 불러오는 데 실패했습니다.');
    }
  }, [isAuthenticated, user?.email, navigate]); // 의존성 배열

  useEffect(() => {
    fetchMatchingList(); // 컴포넌트 마운트 시 데이터 불러오기
  }, [fetchMatchingList]); // fetchMatchingList가 변경될 때만 다시 실행

  // 각 뷰 컴포넌트에 대한 ref 생성 (CSSTransition에 필요)
  const calendarRef = useRef(null);
  const listRef = useRef(null);

  // 모든 매칭 데이터를 기반으로 캘린더 이벤트 생성
  const calendarEvents = useMemo(() => {
    const events = [];
    matchingList.forEach((match) => {
      // API 응답의 `history` 배열 필드를 확인합니다.
      // `history`는 `selectDate` 필드를 포함해야 합니다.
      if (match.history && match.history.length > 0) {
        match.history.forEach((session) => {
          // session.date 대신 session.selectDate를 사용합니다.
          if (!session.selectDate) return; // selectDate가 없으면 해당 session 건너뜀

          // "YYYY-MM-DD HH:MM:SS" 형식에서 날짜만 파싱
          const datePart = session.selectDate.split(' ')[0];
          const [year, month, day] = datePart.split('-').map(Number);
          const eventDate = new Date(year, month - 1, day); // month는 0부터 시작

          events.push({
            // 고객 이름을 `userName` 필드에서 가져오고, 없으면 `coachName` 사용
            title: `${match.userName || match.coachName} - ${match.sessions}회차`, // `match.sessions`는 전체 횟수를 나타내는 것으로 가정
            start: eventDate,
            end: moment(eventDate).endOf('day').toDate(),
            type: 'session',
            matchId: match.reservationId, // 매칭 자체의 고유 ID (예약 ID)
            status: match.status, // 매칭의 상태 (완료됨, 진행중, 취소됨, 승인 대기중)
            initial: (match.userName || match.coachName)?.charAt(0) || '', // 고객 이름의 첫 글자
          });
        });
      }
    });
    return events;
  }, [matchingList]); // matchingList가 변경될 때마다 다시 계산

  // 이벤트 Prop Getter (캘린더 이벤트 스타일링)
  const eventPropGetter = (event) => {
    let newStyle = {
      backgroundColor: 'lightgray',
      color: 'black',
      borderRadius: '4px',
      border: '1px solid transparent',
      fontSize: '12px',
      padding: '2px 5px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    };

    switch (event.status) {
      case '완료됨':
        newStyle.backgroundColor = '#DBFCDA'; // 연한 녹색
        newStyle.color = '#26B326'; // 진한 녹색 텍스트
        newStyle.border = '1px solid #B4F8B4';
        break;
      case '진행중':
        newStyle.backgroundColor = '#D9EDF7'; // 연한 파란색
        newStyle.color = '#31708F'; // 진한 파란색 텍스트
        newStyle.border = '1px solid #BCE8F1';
        break;
      case '취소됨':
        newStyle.backgroundColor = '#FCDADA'; // 연한 빨간색
        newStyle.color = '#B32626'; // 진한 빨간색 텍스트
        newStyle.border = '1px solid #F8B4F4';
        break;
      case '승인 대기중': // '승인 대기중' 상태에 대한 스타일 추가
      default:
        // 정의되지 않은 상태에 대한 기본값 (혹은 없는 경우)
        newStyle.backgroundColor = '#D0E3FC';
        newStyle.color = '#2667B3';
        newStyle.border = '1px solid #B4D6F8';
        break;
    }
    return {
      className: '',
      style: newStyle,
    };
  };

  // 이벤트 렌더링 컴포넌트 (캘린더 내 각 이벤트 블록의 내용)
  const Event = ({ event }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 코치 이름의 첫 글자를 initial로 표시 */}
        {event.initial && (
          <span className="event-initial" style={{ fontWeight: 'bold' }}>
            {event.initial}
          </span>
        )}
        <span className="event-title">{event.title}</span>
      </div>
    );
  };

  // 뷰 변경 핸들러 (CoachSubBar에서 호출될 함수)
  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <>
      <ContentWrapper>
        <TitleBar title="코칭 내역" />
      </ContentWrapper>
      <CalendarContainer>
        {/* TransitionGroup으로 뷰 전환을 감싸 애니메이션 적용 */}
        <TransitionGroup component={null}>
          {view === 'month' && (
            <CSSTransition
              nodeRef={calendarRef} // ref 연결
              key="calendar-view"
              timeout={300} // 애니메이션 지속 시간 (ms)
              classNames="fade" // CSS 클래스 프리픽스
            >
              <div ref={calendarRef} className="view-transition-wrapper">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  defaultView="month"
                  toolbar={true}
                  views={['month']} // Calendar 컴포넌트가 내부적으로 지원하는 뷰는 'month'만
                  date={currentDate}
                  onNavigate={(newDate) => setCurrentDate(newDate)}
                  components={{
                    toolbar: (props) => (
                      <CustomToolbar
                        {...props}
                        onView={handleViewChange} // CustomToolbar를 통해 CoachSubBar에 우리의 handleViewChange를 전달
                        view={view} // CustomToolbar에도 현재 뷰 상태 전달
                      />
                    ),
                    event: Event,
                  }}
                  eventPropGetter={eventPropGetter}
                />
              </div>
            </CSSTransition>
          )}
          {view === 'list' && (
            <CSSTransition
              nodeRef={listRef} // ref 연결
              key="list-view"
              timeout={300} // 애니메이션 지속 시간 (ms)
              classNames="fade" // CSS 클래스 프리픽스
            >
              <div ref={listRef} className="view-transition-wrapper">
                <CoachMatchingList
                  allMatchingData={matchingList}
                  onView={handleViewChange} // CoachSubBar에 뷰 변경 핸들러 전달
                  currentView={view} // CoachSubBar에 현재 뷰 상태 전달
                  onDataUpdate={fetchMatchingList} // 하위 컴포넌트에서 데이터 갱신 요청 시 호출될 콜백
                />
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </CalendarContainer>
    </>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 850px; /* 둘 다 커버 가능하도록 충분히 확보 */

  .view-transition-wrapper {
    position: absolute;
    width: 1008px;
    top: 0px;
    transition: opacity 300ms ease-in-out;
  }

  .fade-enter {
    opacity: 0;
    z-index: 1;
  }

  .fade-enter-active {
    opacity: 1;
    z-index: 1;
  }

  .fade-exit {
    opacity: 1;
    z-index: 0;
  }

  .fade-exit-active {
    opacity: 0;
    z-index: 0;
  }
`;

export default CoachCalendar;
