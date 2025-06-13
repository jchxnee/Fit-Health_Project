import React from 'react';
import styled from 'styled-components';
// Calendar와 react-calendar 관련 임포트는 이 모달에서는 사용되지 않으므로 제거합니다.
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import theme from '../../styles/theme'; // theme 파일 경로는 그대로 유지

// 기존 ModalOverlay, ModalContent는 재사용합니다.
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
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  position: relative;
  
  /* 이미지에 맞춰 padding, width 조정 */
  padding: 40px 32px; /* 상하좌우 패딩 */
  max-width: 700px; /* 고정된 너비 */
  min-height: 480px; /* 최소 높이 */
  justify-content: space-between; /* 내부 요소들을 상하로 벌리기 */

  @media (max-width: ${theme.width.sm}) {
    padding: ${theme.spacing[5]};
    width: ${theme.width.xs};
  }
`;

// 이미지에 있는 닫기 버튼 아이콘에 맞춰 CloseButton 스타일 조정
const CloseButton = styled.button`
    position: absolute; /* 모달의 오른쪽 상단에 고정 */
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px; /* X 아이콘 크기 */
    cursor: pointer;
    color: ${theme.colors.gray['600']};
    padding: 0; /* 기본 패딩 제거 */

    &:hover {
        color: ${theme.colors.gray['900']};
    }
`;

// 새로운 스타일 컴포넌트 추가
const WarningSection = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]}; /* 아이콘과 텍스트 사이 간격 */
    margin-bottom: ${theme.spacing[4]}; /* 아래쪽 여백 */
`;

const WarningIcon = styled.span`
    color: ${theme.colors.gray['500']}; /* 아이콘 색상 */
    font-size: ${theme.fontSizes.xl}; /* 아이콘 크기 */
    line-height: 1; /* 아이콘과 텍스트 정렬을 위해 */
    font-weight: bold; /* 느낌표 아이콘 굵기 */
`;

const WarningTitle = styled.h3`
  font-size: ${theme.fontSizes.xl}; /* 제목 글자 크기 */
  color: ${theme.colors.gray['900']};
  margin: 0; /* 기본 마진 제거 */
  font-weight: ${theme.fontWeights.medium}; /* 굵기 */
`;

const ContentParagraph = styled.p`
    text-align: left;
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.gray['700']};
    line-height: 1.6; /* 줄 간격 */
    margin-bottom: ${theme.spacing[5]}; /* 아래쪽 여백 */
`;

const StyledList = styled.ul`
    text-align: left;
  list-style: none; /* 기본 리스트 스타일 제거 */
  padding: 0;
  margin-left: 16px; /* 이미지와 동일하게 들여쓰기 */
  margin-bottom: ${theme.spacing[8]}; /* 아래쪽 여백 */
`;

const ListItem = styled.li`
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.gray['700']};
    line-height: 1.6;
    margin-bottom: ${theme.spacing[3]}; /* 각 항목 아래 여백 */
    position: relative;
    padding-left: 12px; /* 점 아이콘을 위한 공간 */

    &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${theme.colors.gray['500']}; /* 점 아이콘 색상 */
        font-size: ${theme.fontSizes.md};
        line-height: 1.6;
    }

    &:last-child {
        margin-bottom: 0; /* 마지막 항목 아래 여백 제거 */
    }
`;

const ConfirmQuestion = styled.p`
    font-size: ${theme.fontSizes.lg};
    color: ${theme.colors.gray['900']};
    text-align: left;
    font-weight: ${theme.fontWeights.medium};
    margin-top: auto; /* 하단에 붙도록 */
    margin-bottom: ${theme.spacing[5]}; /* 버튼과의 간격 */
`;

const ApproveButton = styled.button`
  background-color: ${theme.colors.primary}; /* 테마의 primary 색상 사용 */
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md}; /* 둥근 모서리 */
  padding: 16px 24px; /* 버튼 패딩 */
  font-size: ${theme.fontSizes.xl}; /* 버튼 텍스트 크기 */
  font-weight: ${theme.fontWeights.bold};
  cursor: pointer;
  width: 100%; /* 너비를 100%로 설정 */
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primaryDark}; /* 호버 시 더 어두운 색상 */
  }
`;

// `coachName`, `sessions`, `history` props는 이 모달에서 사용되지 않으므로 제거합니다.
const MatchingApprove = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // '승인' 버튼 클릭 시 실행될 함수 (예: API 호출)
    const handleApprove = () => {
        alert('신청이 승인되었습니다!'); // 임시 알림
        onClose(); // 모달 닫기
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton> {/* X 아이콘 */}

                <WarningSection>
                    <WarningIcon>ⓘ</WarningIcon> {/* 느낌표 아이콘 */}
                    <WarningTitle>고객 신청 승인 전 꼭 확인해주세요!</WarningTitle>
                </WarningSection>

                <ContentParagraph>
                    고객의 신청을 승인하면, 해당 고객은 곧 결제 및 트레이닝을 진행하게 됩니다.<br />
                    승인 이후에는 트레이너로서 다음 사항에 대해 책임이 발생합니다.
                </ContentParagraph>

                <StyledList>
                    <ListItem>
                        승인 후 트레이닝을 고의로 미루거나, 연락을 끊고 이행하지 않는 '먹튀' 행위 적발 시,<br />
                        고객 보호를 위해 결제 금액의 최대 5배까지 배상 청구 및 형사 고발 조치가 진행될 수 있습니다.
                    </ListItem>
                    <ListItem>
                        승인 후에는 고객이 실제로 비용을 결제하게 되므로, 단순한 호기심이나 테스트로 승인하지 마세요.<br />
                        승인 자체가 정식 계약 의사로 간주되며, 이에 따른 책임이 발생합니다.
                    </ListItem>
                </StyledList>

                <ConfirmQuestion>
                    핏코칭 요청을 승인하시겠습니까?
                </ConfirmQuestion>

                <ApproveButton onClick={handleApprove}>
                    승인
                </ApproveButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default MatchingApprove;