import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko'; // Import Korean locale for moment
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarStyles.css'; // We'll create this for custom styles
import CoachSubBar from '../CoachSubBar'; // Import CoachSubBar
import Header from '../Header';
import Footer from '../Footer';
import CoachList from '../../pages/coach/CoachList';
import CoachMatchingList from './CoachMatchingList';
import styled from 'styled-components';

moment.locale('ko'); // Set moment to use Korean locale
const localizer = momentLocalizer(moment);

// Custom Toolbar Component
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
        <span className="rbc-btn-group rbc-nav-arrows"></span>
        <CoachSubBar onView={onView} currentView={view} />
      </span>
    </div>
  );
};

function MyCalendar() {
  const userInfo = {
    name: '이주찬',
    img: '../src/assets/beta_user_img.png',
  };
  // Set the initial date to October 2024 as in the new image
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // October is month 9 (0-indexed)
  const [view, setView] = useState('month'); // Keep track of the current view

  const events = useMemo(
    () => [
      {
        title: '임시공휴일',
        start: new Date(2024, 9, 1), // Oct 1st
        end: new Date(2024, 9, 1, 23, 59, 59),
        type: 'holiday',
        initial: 'H',
      },
      {
        title: '개천절',
        start: new Date(2024, 9, 3), // Oct 3rd
        end: new Date(2024, 9, 3, 23, 59, 59),
        type: 'holiday',
        initial: 'H',
      },
      {
        title: '한글날',
        start: new Date(2024, 9, 9), // Oct 9th
        end: new Date(2024, 9, 9, 23, 59, 59),
        type: 'holiday',
        initial: 'H',
      },
      {
        title: '전시회 방문',
        start: new Date(2024, 9, 10), // Oct 10th
        end: new Date(2024, 9, 10, 23, 59, 59),
        type: 'personal',
        initial: 'P',
      },
      {
        title: 'FE 스터디', // Changed title
        start: new Date(2024, 9, 13), // Oct 13th
        end: new Date(2024, 9, 13, 23, 59, 59),
        type: 'green',
        initial: 'S',
      },
      {
        title: '운동',
        start: new Date(2024, 9, 16), // Oct 16th
        end: new Date(2024, 9, 16, 12, 0, 0),
        type: 'activity',
        initial: 'G',
      },
      {
        title: '은행업무',
        start: new Date(2024, 9, 16, 13, 0, 0),
        end: new Date(2024, 9, 16, 17, 0, 0),
        type: 'errand',
        initial: 'E',
      },
      {
        title: '여행', // Changed title
        start: new Date(2024, 9, 20), // Oct 20th
        end: new Date(2024, 9, 22, 23, 59, 59), // Spanning multiple days
        type: 'long_personal',
        initial: 'P',
      },
    ],
    []
  );

  const eventPropGetter = (event, start, end, isSelected) => {
    let newStyle = {
      backgroundColor: 'lightgray', // Default
      color: 'black',
      borderRadius: '4px', // Slightly rounded corners
      border: '1px solid transparent', // Subtle border
      fontSize: '12px',
      padding: '2px 5px', // More padding
      display: 'flex',
      alignItems: 'center',
      gap: '5px', // Space between initial and title
    };

    switch (event.type) {
      case 'holiday':
        newStyle.backgroundColor = '#FCDADA'; // Lighter red
        newStyle.color = '#B32626'; // Darker red text
        newStyle.border = '1px solid #F8B4B4';
        break;
      case 'personal':
        newStyle.backgroundColor = '#FCE0F6'; // Lighter pink
        newStyle.color = '#B326B3'; // Darker pink text
        newStyle.border = '1px solid #F8B4F8';
        break;
      case 'green':
        newStyle.backgroundColor = '#DBFCDA'; // Lighter green
        newStyle.color = '#26B326'; // Darker green text
        newStyle.border = '1px solid #B4F8B4';
        break;
      case 'activity':
        newStyle.backgroundColor = '#D0E3FC'; // Lighter blue
        newStyle.color = '#2667B3'; // Darker blue text
        newStyle.border = '1px solid #B4D6F8';
        break;
      case 'errand':
        newStyle.backgroundColor = '#FBFCD0'; // Lighter yellow
        newStyle.color = '#B3B326'; // Darker yellow text
        newStyle.border = '1px solid #F8F8B4';
        break;
      case 'long_personal':
        newStyle.backgroundColor = '#FCE0F6'; // Similar to personal, light pink
        newStyle.color = '#B326B3';
        newStyle.border = '1px solid #F8B4F8';
        break;
      default:
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
        {event.initial && (
          <span className="event-initial" style={{ fontWeight: 'bold' }}>
            {event.initial}
          </span>
        )}
        <span className="event-title">{event.title}</span>
      </div>
    );
  };

  return (
    <>
      <Header user={userInfo} />
      <CalendarContainer>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          defaultView="month"
          toolbar={true}
          views={['month']} // Allow month, week, day views
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          onView={(newView) => setView(newView)} // Update view state
          components={{
            toolbar: CustomToolbar,
            event: Event,
          }}
          eventPropGetter={eventPropGetter}
        />
      </CalendarContainer>
      <CoachMatchingList />
      <Footer />
    </>
  );
}

const CalendarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;
export default MyCalendar;
