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
      if (match.history && match.history.length > 0) {
        const totalSessions = match.history.length;

        match.history.forEach((session, index) => {
          if (!session.selectDate) return;

          const datePart = session.selectDate.split(' ')[0];
          const [year, month, day] = datePart.split('-').map(Number);
          const eventDate = new Date(year, month - 1, day);

          const currentSessionNumber = index + 1;

          events.push({
            title: `${match.userName} - ${currentSessionNumber}/${totalSessions}회차`,
            start: eventDate,
            end: moment(eventDate).endOf('day').toDate(),
            type: 'session',
            matchId: match.reservationId,
            status: match.status,
            initial: (match.userName || match.coachName)?.charAt(0) || '',
          });
        });
      }
    });
    return events;
  }, [matchingList]);

  // 이벤트 Prop Getter (캘린더 이벤트 스타일링)
  const eventPropGetter = (event) => {
    let newStyle = {
      backgroundColor: 'lightgray',
      color: 'black',
      borderRadius: '4px',
      border: '1px solid transparent',
      fontSize: '12px',
      padding: '5px 15px',
      display: 'flex',
      alignItems: 'center',

      gap: '5px',
      width: '100%',
      height: '100%',
    };

    switch (event.status) {
      case '완료됨':
        newStyle.backgroundColor = '#22c55e';
        newStyle.color = '#FFFFFF';
        break;
      case '진행중':
        newStyle.backgroundColor = '#D9EDF7';
        newStyle.color = '#31708F';
        newStyle.border = '1px solid #BCE8F1';
        break;
      case '취소됨':
        newStyle.backgroundColor = '#FCDADA';
        newStyle.color = '#B32626';
        newStyle.border = '1px solid #F8B4F4';
        break;
      case '승인 대기중':
        newStyle.backgroundColor = '#f6e071';
        newStyle.color = '#1a1919';
        break;
    }

    return {
      className: '',
      style: newStyle,
    };
  };

  const Event = ({ event }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className="event-title">{event.title}</span>
      </div>
    );
  };

  // 뷰 변경 핸들러 (CoachSubBar에서 호출될 함수)
  const handleViewChange = (newView) => {
    setView(newView);
  };

  const formats = useMemo(
    () => ({
      weekdayFormat: (date, culture, localizer) => localizer.format(date, 'ddd', culture), // 'ddd'는 '일', '월', '화' 등 축약된 요일을 의미합니다.

      dayFormat: (date, culture, localizer) => localizer.format(date, 'dd일', culture),
      monthHeaderFormat: 'YYYY년 MM월',
      dayHeaderFormat: 'MM월 DD일(ddd)',
      dateFormat: 'D',
    }),
    []
  );

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
                  culture="ko"
                  formats={formats}
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  defaultView="month"
                  messages={{
                    showMore: () => `+ 일정 더보기`,
                  }}
                  toolbar={true}
                  views={['month']} // Calendar 컴포넌트가 내부적으로 지원하는 뷰는 'month'만
                  date={currentDate}
                  onNavigate={(newDate) => setCurrentDate(newDate)}
                  popup
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
                  onView={handleViewChange}
                  currentView={view}
                  onDataUpdate={fetchMatchingList}
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
