import React, { useState } from 'react'; // useState를 사용하여 입력창 상태 관리
import styled from 'styled-components';
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
  padding: 40px 32px; /* 상하좌우 패딩 */
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: 700px; /* 이미지에 맞춰 max-width 조정 */
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 내부 요소들을 상하로 벌리기 */
  position: relative;
  gap: ${theme.spacing[5]}; /* 요소들 사이의 기본 간격 */

  @media (max-width: ${theme.width.sm}) {
    padding: ${theme.spacing[5]};
    width: ${theme.width.xs};
  }
`;

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

// "거절사유" 라벨 스타일
const RejectReasonLabel = styled.label`
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.gray['900']};
    font-weight: ${theme.fontWeights.medium};
    text-align: left;
    margin-bottom: ${theme.spacing[3]}; /* 입력창과의 간격 */
`;

// 입력창 스타일
const ReasonTextArea = styled.textarea`
    width: 100%;
    height: 100px; /* 고정된 높이 */
    padding: ${theme.spacing[4]};
    border: 1px solid ${theme.colors.gray['300']};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.gray['100']}; /* 배경색 설정 */
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.gray['900']};
    resize: none; /* 사용자 크기 조절 비활성화 */
    line-height: 1.5; /* 줄 간격 */
    margin-bottom: ${theme.spacing[5]}; /* 하단과의 간격 */

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary}; /* 포커스 시 테두리 색상 변경 */
        box-shadow: 0 0 0 1px ${theme.colors.primary}; /* 포커스 시 그림자 */
    }

    &::placeholder {
        color: ${theme.colors.gray['500']};
    }
`;


const ConfirmQuestion = styled.p`
    font-size: ${theme.fontSizes.lg};
    color: ${theme.colors.gray['900']};
    text-align: center; /* 질문 텍스트 가운데 정렬 */
    font-weight: ${theme.fontWeights.medium};
    margin-top: auto; /* 하단에 붙도록 */
    margin-bottom: ${theme.spacing[5]}; /* 버튼과의 간격 */
`;

// "거절" 버튼 스타일 (색상 변경)
const RejectButton = styled.button`
    background-color: ${theme.colors.danger}; /* 거절 버튼은 danger 색상 사용 */
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: 16px 24px;
    font-size: ${theme.fontSizes.xl};
    font-weight: ${theme.fontWeights.bold};
    cursor: pointer;
    width: 100%;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${theme.colors.dangerDark}; /* 호버 시 더 어두운 색상 */
    }
`;

const MatchingRefuse = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [rejectReason, setRejectReason] = useState(''); // 거절 사유 상태

    // '거절' 버튼 클릭 시 실행될 함수
    const handleReject = () => {
        if (rejectReason.trim() === '') {
            alert('거절 사유를 입력해주세요.');
            return;
        }
        console.log('거절 사유:', rejectReason);
        alert('신청이 거절되었습니다!'); // 임시 알림
        onClose(); // 모달 닫기
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton> {/* X 아이콘 */}

                <WarningSection>
                    <WarningIcon>ⓘ</WarningIcon> {/* 느낌표 아이콘 */}
                    <WarningTitle>고객 신청 거절 전 꼭 확인해주세요!</WarningTitle>
                </WarningSection>

                <ContentParagraph>
                    고객의 신청을 거절하면 해당 예약은 취소되며, 고객은 다시 예약을 진행해야 합니다.<br />
                    정당한 사유 없이 반복적으로 거절할 경우 불이익이 발생할 수 있습니다.
                </ContentParagraph>

                {/* StyledList 대신 새로운 섹션 추가 */}
                <RejectReasonLabel htmlFor="reject-reason">거절사유</RejectReasonLabel>
                <ReasonTextArea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="예: 갑작스러운 건강 악화로 병원 일정때문에 취소드립니다. 죄송합니다."
                />

                <ConfirmQuestion>
                    요청을 거절하시겠습니까?
                </ConfirmQuestion>

                <RejectButton onClick={handleReject}>
                    거절
                </RejectButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default MatchingRefuse;