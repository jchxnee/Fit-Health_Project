import React from 'react';
import styled from 'styled-components';
import { FaListUl } from 'react-icons/fa'; // 리스트 아이콘
import { PiCalendar } from 'react-icons/pi'; // 캘린더 아이콘

const StyledButtonsContainer = styled.div`
    display: inline-flex;
    gap: ${({ theme }) => theme.spacing['1']};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing['1']};
`;

const StyledIconButton = styled.button`
    border: none;
    padding: ${({ theme }) => theme.spacing['3']};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: background-color 0.2s ease;

    &:hover,
    &:focus {
        background: #ccc;
        box-shadow: ${({ theme }) => theme.shadows.sm};
    }

    &.active { /* 활성화된 버튼에 적용될 스타일 */
        background-color: ${({ theme }) => theme.colors.white};
        box-shadow: ${({ theme }) => theme.shadows.sm};
    }

    & > svg {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        color: ${({ theme }) => theme.colors.gray['700']};
    }
`;

const StyledCalendarIcon = styled(StyledIconButton)`

    & > svg {
        font-size: ${({ theme }) => theme.fontSizes['2xl']}; /* 캘린더 아이콘은 더 크게 */
    }
`;

// CoachSubBar 컴포넌트는 onView 콜백과 현재 뷰 상태를 받습니다.
const CoachSubBar = ({ onView, currentView }) => {
    return (
        <StyledButtonsContainer>
            {/* 리스트 뷰 버튼 */}
            <StyledIconButton
                onClick={() => onView('list')} // 클릭 시 'list' 뷰로 전환 요청
                className={currentView === 'list' ? 'active' : ''} // currentView가 'list'일 때 active 클래스 적용
            >
                <FaListUl /> {/* 리스트 아이콘 */}
            </StyledIconButton>

            {/* 캘린더 뷰 버튼 */}
            <StyledCalendarIcon
                onClick={() => onView('month')} // 클릭 시 'month' 뷰로 전환 요청
                className={currentView === 'month' ? 'active' : ''} // currentView가 'month'일 때 active 클래스 적용
            >
                <PiCalendar /> {/* 캘린더 아이콘 */}
            </StyledCalendarIcon>
        </StyledButtonsContainer>
    );
};

export default CoachSubBar;