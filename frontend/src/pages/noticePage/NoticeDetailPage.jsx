import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEllipsisV } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom'; // useParams와 useNavigate 추가
import TitleBar from '../../components/TitleBar';
import { API_ENDPOINTS } from '../../api/config'; // API 엔드포인트 가져오기
import api from '../../api/axios'; // axios 인스턴스 가져오기
import useUserStore from '../../store/useUserStore';
import { toast } from 'react-toastify';

function NoticeDetailPage() {
  const { noticeNo } = useParams(); // URL 파라미터에서 noticeNo 추출
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [noticeDetail, setNoticeDetail] = useState(null); // 공지사항 상세 데이터를 위한 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUserStore();

  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 공지를 삭제하시겠습니까?')) {
      return;
    }
    try {
      await api.put(`${API_ENDPOINTS.NOTICE.DELETE}/${noticeNo}`);
      toast.success('공지글이 삭제되었습니다.');
      navigate('/notice');
    } catch (err) {
      console.error('공지글 삭제 중 오류 발생:', err);
      toast.error('공지글 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    console.log('NoticeDetailPage useEffect 시작. noticeNo:', noticeNo); // 이 부분을 추가
    const fetchNoticeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_ENDPOINTS.NOTICE.DETAIL}/${noticeNo}`);
        setNoticeDetail(response.data); // 백엔드에서 반환된 상세 데이터 설정
      } catch (err) {
        console.error('공지사항 상세 데이터를 불러오는 데 실패했습니다:', err);
        setError('공지사항 상세 정보를 불러오는 중 오류가 발생했습니다.');
        setNoticeDetail(null); // 에러 발생 시 데이터 초기화
      } finally {
        setLoading(false);
      }
    };

    if (noticeNo) {
      // noticeNo가 유효할 때만 API 호출
      fetchNoticeDetail();
    }
  }, [noticeNo]); // noticeNo가 변경될 때마다 API 다시 호출

  // 날짜 포맷팅 함수 (NoticePage와 동일)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR'); // YYYY. MM. DD 형식
  };

  const handleToListClick = () => {
    navigate('/notice'); // 공지사항 목록 페이지 경로로 이동
  };

  if (loading) {
    return (
      <PageContainer>
        <TitleBar title="공지사항" />
        <ContentWrapper>
          <NoticeDetailContainer>
            <NoticeContentText>공지사항을 불러오는 중...</NoticeContentText>
          </NoticeDetailContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <TitleBar title="공지사항" />
        <ContentWrapper>
          <NoticeDetailContainer>
            <NoticeContentText>{error}</NoticeContentText>
            <ButtonWrapper>
              <ToListButton onClick={handleToListClick}>목록으로</ToListButton>
            </ButtonWrapper>
          </NoticeDetailContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!noticeDetail) {
    return (
      <PageContainer>
        <TitleBar title="공지사항" />
        <ContentWrapper>
          <NoticeDetailContainer>
            <NoticeContentText>공지사항을 찾을 수 없습니다.</NoticeContentText>
            <ButtonWrapper>
              <ToListButton onClick={handleToListClick}>목록으로</ToListButton>
            </ButtonWrapper>
          </NoticeDetailContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <TitleBar title="공지사항" />
        <ContentWrapper>
          <NoticeDetailContainer>
            <PostInfo>
              <NoticeTitle>{noticeDetail.notice_title}</NoticeTitle> {/* 백엔드 응답 필드명에 맞춤 */}
              {user.grade === 'A' && (
                <>
                  <EllipsisButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <FaEllipsisV color="#757575" />
                  </EllipsisButton>
                  {isMenuOpen && (
                    <DropdownMenu>
                      <DropdownMenuItem onClick={() => navigate(`/notice/${noticeNo}/edit`)}>수정</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeletePost}>삭제</DropdownMenuItem>
                    </DropdownMenu>
                  )}
                </>
              )}
            </PostInfo>
            <NoticeDate>{formatDate(noticeDetail.created_date)}</NoticeDate> {/* 백엔드 응답 필드명에 맞춤 */}
            <NoticeContentLine />
            <NoticeContentText>{noticeDetail.notice_content}</NoticeContentText> {/* 백엔드 응답 필드명에 맞춤 */}
            <ButtonWrapper>
              <ToListButton onClick={handleToListClick}>목록으로</ToListButton>
            </ButtonWrapper>
          </NoticeDetailContainer>
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default NoticeDetailPage;

// --- 스타일 컴포넌트 ---
// (이전과 동일한 스타일 컴포넌트)

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: ${({ theme }) => theme.width.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing['6']};
  display: flex;
  flex-direction: column; /* 단일 컨텐츠이므로 column으로 설정 */
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['3']};
`;

const NoticeDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const NoticeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray['800']};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  text-align: left;
`;

const NoticeDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray['500']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  text-align: left;
`;

const NoticeContentLine = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray['300']};
  margin-bottom: ${({ theme }) => theme.spacing['6']};
`;

const NoticeContentText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['700']};
  line-height: 1.8;
  white-space: pre-wrap; /* 줄바꿈을 유지 */
  margin-bottom: ${({ theme }) => theme.spacing['20']};
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing['32']};
`;

const ToListButton = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray['700']};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['44']};
  font-size: ${({ theme }) => theme.fontSizes.md};
  outline: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const EllipsisButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray['700']};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray['200']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  min-width: 100px;
  overflow: hidden;
`;
const DropdownMenuItem = styled.div`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray['800']};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['100']};
  }
`;
const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;
