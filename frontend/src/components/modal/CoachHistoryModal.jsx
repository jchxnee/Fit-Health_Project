import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css'; // 사용하지 않아도 스타일이 필요할 수 있습니다.
import theme from '../../styles/theme';
import MatchingApprove from './MatchingApprove';
import MatchingRefuse from './MatchingRefuse';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  padding: 40px 32px;
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: 800px; /* 너비 확장 */
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  position: relative;
  min-height: 500px; /* 최소 높이 설정 */

  @media (max-width: ${theme.width.sm}) {
    padding: ${theme.spacing[5]};
    width: ${theme.width.xs};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.gray['600']};
  padding: 0;

  &:hover {
    color: ${theme.colors.gray['900']};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[3]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.gray['900']};
  margin: 0;
  font-weight: ${theme.fontWeights.bold};
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  flex-grow: 1; /* 컨텐츠가 남은 공간을 채우도록 함 */
`;

const HistoryListWrapper = styled.div`
  max-height: 300px; /* 스크롤 가능한 영역 설정 */
  overflow-y: auto;
  padding-right: ${theme.spacing[2]}; /* 스크롤바 공간 확보 */
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
`;

const HistoryListItem = styled.li`
  background-color: ${(props) => (props.$isSessionDate ? theme.colors.primaryLight : theme.colors.gray[50])};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
  list-style: none;
  border: 1px solid ${(props) => (props.$isSessionDate ? theme.colors.primary : theme.colors.gray[200])};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  box-shadow: ${theme.shadows.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const HistoryItemTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* 반응형을 위해 추가 */
  gap: ${theme.spacing[2]};
`;

const HistoryDate = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray[900]};
`;

const HistorySessionStatus = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  margin-left: ${theme.spacing[2]};
  color: ${(props) => {
    switch (props.children.toString().trim()) {
      case '(승인됨)':
        return theme.colors.success;
      case '(거절됨)':
        return theme.colors.danger;
      case '(승인 대기중)':
        return theme.colors.warning;
      default:
        return theme.colors.gray[700];
    }
  }};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ActionButton = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${(props) => (props.$isApprove ? theme.colors.primary : theme.colors.danger)};
  color: ${theme.colors.white};
  border: 1px solid ${(props) => (props.$isApprove ? theme.colors.primary : theme.colors.danger)};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$isApprove ? theme.colors.primaryDark : theme.colors.dangerDark)};
    border-color: ${(props) => (props.$isApprove ? theme.colors.primaryDark : theme.colors.dangerDark)};
  }

  &:disabled {
    background-color: ${theme.colors.gray[300]};
    border-color: ${theme.colors.gray[300]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const RejectComment = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[700]};
  margin-top: ${theme.spacing[1]};
  padding-left: ${theme.spacing[2]};
  border-left: 2px solid ${theme.colors.gray[300]};
  background-color: ${theme.colors.gray[100]};
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
`;

// onUpdateSuccess prop을 받습니다.
const CoachHistoryModal = ({ isOpen, onClose, userName, sessions, history, onUpdateSuccess }) => {
  if (!isOpen) {
    return null;
  }

  const [activeDate, setActiveDate] = useState(new Date()); // 캘린더는 실제 렌더링에 사용되지 않지만 상태는 유지

  // MatchingApprove 모달 관련 상태
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveTargetReservationNo, setApproveTargetReservationNo] = useState(null);

  // MatchingRefuse 모달 관련 상태
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  const [refuseTargetReservationNo, setRefuseTargetReservationNo] = useState(null);

  useEffect(() => {
    if (history) {
      console.log('CoachHistoryModal: received history prop:', history);
      history.forEach((item, index) => {
        console.log(`History item ${index}: item.reservationNo =`, item.reservationNo);
        // 만약 백엔드에서 reservationNo로 내려온다면, item.reservationNo도 함께 로그 찍어보세요.
        // console.log(`History item ${index}: item.reservationNo =`, item.reservationNo);
      });
    }
  }, [history]); // history prop이 변경될 때마다 실행

  // 이 useMemo는 캘린더에 필요하지만, 캘린더가 렌더링되지 않으므로 사실상 불필요할 수 있습니다.
  // 데이터를 처리하는 로직 자체는 그대로 두겠습니다.
  const sessionDates = useMemo(
    () =>
      history
        .map((item) => {
          const datePart = item.selectDate.split(' ')[0];
          const [year, month, day] = datePart.split('-').map(Number);
          const dateObj = new Date(year, month - 1, day);
          return dateObj;
        })
        .filter((date) => date instanceof Date && !isNaN(date.getTime())),
    [history]
  );

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // '승인' 버튼 클릭 핸들러: MatchingApprove 모달을 띄웁니다.
  const handleApproveButtonClick = (reservationNo) => {
    console.log('CoachHistoryModal: Setting approveTargetReservationNo to:', reservationNo);
    setApproveTargetReservationNo(reservationNo);
    setIsApproveModalOpen(true);
  };

  // MatchingApprove 모달에서 승인이 성공적으로 완료되면 호출될 함수
  const handleApproveSuccess = (reservationNo) => {
    setIsApproveModalOpen(false); // 승인 모달 닫기
    setApproveTargetReservationNo(null);
    onClose(); // CoachHistoryModal 자체를 닫음
    if (onUpdateSuccess) {
      // 상위 컴포넌트(CoachMatchingList)에게 데이터 갱신을 알림
      onUpdateSuccess(reservationNo, 'Y');
    }
  };

  // '거절' 버튼 클릭 핸들러: MatchingRefuse 모달을 띄웁니다.
  const handleRejectButtonClick = (reservationNo) => {
    console.log('CoachHistoryModal: Setting approveTargetReservationNo to:', reservationNo);
    setRefuseTargetReservationNo(reservationNo);
    setIsRefuseModalOpen(true);
  };

  // MatchingRefuse 모달에서 거절이 성공적으로 완료되면 호출될 함수
  const handleRejectSuccess = (reservationNo) => {
    setIsRefuseModalOpen(false); // 거절 모달 닫기
    setRefuseTargetReservationNo(null);
    onClose(); // CoachHistoryModal 자체를 닫음
    if (onUpdateSuccess) {
      // 상위 컴포넌트(CoachMatchingList)에게 데이터 갱신을 알림
      onUpdateSuccess(reservationNo, 'N');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{userName} 고객님의 이용 기록</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <HistoryListWrapper>
            {history.length > 0 ? (
              history.map((item, index) => {
                const datePartForHighlight = item.selectDate.split(' ')[0];
                const [year, month, day] = datePartForHighlight.split('-').map(Number);
                const safeItemDate = new Date(year, month - 1, day);

                const isItemSessionDate = sessionDates.some((sessionDate) => isSameDay(sessionDate, safeItemDate));

                // item.status는 'Y', 'N', 또는 아직 처리되지 않은 상태일 수 있습니다.
                // 'N'은 거절됨을 의미하지만, '승인 대기중' 상태와 구분하기 위해 rejectComment 존재 여부로 판단합니다.
                const isApproved = item.status === 'Y';
                const isRejected = item.status === 'N' && item.rejectComment; // 거절 사유가 있으면 '거절됨'
                const isPending = item.status === 'N' && !item.rejectComment; // 거절 사유가 없으면 '승인 대기중'

                return (
                  <HistoryListItem key={item.reservationNo || index} $isSessionDate={isItemSessionDate}>
                    <HistoryItemTopRow>
                      <HistoryDate>
                        {index + 1}회차: {item.selectDate} {}
                        {isApproved && <HistorySessionStatus>(승인됨)</HistorySessionStatus>}
                        {isRejected && <HistorySessionStatus>(거절됨)</HistorySessionStatus>}
                        {isPending && <HistorySessionStatus>(승인 대기중)</HistorySessionStatus>}
                      </HistoryDate>
                      <ActionButtonsContainer>
                        <ActionButton
                          $isApprove
                          onClick={() => handleApproveButtonClick(item.reservationNo)}
                          disabled={!isPending} // '승인 대기중'일 때만 활성화
                        >
                          승인
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleRejectButtonClick(item.reservationNo)}
                          disabled={!isPending} // '승인 대기중'일 때만 활성화
                        >
                          거절
                        </ActionButton>
                      </ActionButtonsContainer>
                    </HistoryItemTopRow>
                    {item.rejectComment && <RejectComment>거절 사유: {item.rejectComment}</RejectComment>}
                  </HistoryListItem>
                );
              })
            ) : (
              <p>이용 기록이 없습니다.</p>
            )}
          </HistoryListWrapper>
        </ModalBody>

        {/* MatchingApprove 모달: reservationId와 onApproveSuccess prop을 전달합니다. */}
        <MatchingApprove
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          reservationNo={approveTargetReservationNo}
          onApproveSuccess={handleApproveSuccess} // 콜백 연결
        />

        {/* MatchingRefuse 모달: reservationId와 onRejectSuccess prop을 전달합니다. */}
        <MatchingRefuse
          isOpen={isRefuseModalOpen}
          onClose={() => setIsRefuseModalOpen(false)}
          reservationNo={refuseTargetReservationNo}
          onRejectSuccess={handleRejectSuccess} // 콜백 연결
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default CoachHistoryModal;
