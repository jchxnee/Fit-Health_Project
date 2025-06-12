import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components'; // keyframes와 css 임포트
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TitleBar from '../../components/TitleBar';
import CustomCategoryMenu from '../../components/CustomCategoryMenu';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import betaImg from '../../assets/beta_user_img.png';

// 더미 데이터
const faqData = [
  {
    id: 1,
    category: '환불',
    question: '환불 등록은 어디서 해야 하나요?',
    answer: '마이페이지 > 신청내역에서 환불 신청 가능합니다.',
  },
  {
    id: 2,
    category: '매칭',
    question: '매칭 신청은 어떻게 하나요?',
    answer: '매칭 서비스는 홈 화면에서 신청할 수 있습니다. 자세한 내용은 도움말을 참조해주세요.',
  },
  {
    id: 3,
    category: '회원관리',
    question: '회원정보를 변경하고 싶어요.',
    answer: '마이페이지 > 회원정보 수정에서 변경 가능합니다.',
  },
  {
    id: 4,
    category: '환불',
    question: '환불은 얼마나 걸리나요?',
    answer: '환불은 신청일로부터 영업일 기준 3~5일 소요됩니다.',
  },
  {
    id: 5,
    category: '매칭',
    question: '매칭 취소는 어떻게 하나요?',
    answer: '매칭 취소는 신청내역에서 가능하며, 취소 규정에 따라 수수료가 발생할 수 있습니다.',
  },
  {
    id: 6,
    category: '회원관리',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 페이지에서 "비밀번호 찾기"를 통해 재설정할 수 있습니다.',
  },
  {
    id: 7,
    category: '환불',
    question: '부분 환불도 가능한가요?',
    answer: '네, 서비스 이용 약관에 따라 부분 환불이 가능합니다. 고객센터로 문의해주세요.',
  },
  {
    id: 8,
    category: '매칭',
    question: '여러 코치와 매칭 신청이 가능한가요?',
    answer: '동시에 여러 코치와 매칭 신청은 불가능하며, 한 번에 한 명의 코치와만 매칭할 수 있습니다.',
  },
  {
    id: 9,
    category: '회원관리',
    question: '계정을 삭제하고 싶어요.',
    answer: '마이페이지 > 회원 탈퇴 메뉴에서 계정 삭제가 가능합니다. 탈퇴 전 안내사항을 꼭 확인해주세요.',
  },
  {
    id: 10,
    category: '매칭',
    question: '매칭에 실패하면 어떻게 되나요?',
    answer: '매칭 실패 시, 신청 내역이 자동으로 취소되며, 다시 매칭을 시도할 수 있습니다.',
  },
];

function FAQPage() {
  const [user] = useState({ name: '김현아', img: betaImg });
  const [activeCategory, setActiveCategory] = useState('전체');
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [keyForAnimation, setKeyForAnimation] = useState(0); // FAQContent의 애니메이션을 위한 키

  const filteredFaqs = activeCategory === '전체' ? faqData : faqData.filter((faq) => faq.category === activeCategory);

  const handleQuestionClick = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  // 카테고리 변경 시 애니메이션을 다시 트리거
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setOpenQuestionId(null);
    setKeyForAnimation((prevKey) => prevKey + 1); // 키를 변경하여 FAQContent 애니메이션 리트리거
  };

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="자주 묻는 질문" />
        <ContentWrapper>
          <CustomCategoryMenu
            selectedCategory={activeCategory}
            onSelectCategory={handleSelectCategory} // 변경된 핸들러 사용
            categories={[{ name: '전체' }, { name: '환불' }, { name: '매칭' }, { name: '회원관리' }]}
          />
          <FAQContent key={keyForAnimation}>
            {' '}
            {/* key prop 추가 */}
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <FAQItem key={faq.id}>
                  <QuestionHeader onClick={() => handleQuestionClick(faq.id)}>
                    <QuestionSymbol>Q</QuestionSymbol>
                    <QuestionText>{faq.question}</QuestionText>
                    {openQuestionId === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                  </QuestionHeader>
                  {openQuestionId === faq.id && (
                    <AnswerContainer open={openQuestionId === faq.id}>
                      {' '}
                      {/* open prop 전달 */}
                      <AnswerSymbol>A</AnswerSymbol>
                      <AnswerText>{faq.answer}</AnswerText>
                    </AnswerContainer>
                  )}
                </FAQItem>
              ))
            ) : (
              <NoFAQMessage>해당 카테고리의 질문이 없습니다.</NoFAQMessage>
            )}
          </FAQContent>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
}

export default FAQPage;

// --- 애니메이션 Keyframes ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 200px; /* 실제 답변 내용에 따라 충분히 큰 값으로 설정 */
    opacity: 1;
  }
`;

// --- 스타일 컴포넌트 ---

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
  margin-top: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  display: flex;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']};
  min-height: calc(100vh - 294px); /* 이 값은 실제 컴포넌트 높이에 따라 조정해야 합니다. */
`;

const FAQContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
  animation: ${fadeIn} 1s ease-out; /* 카테고리 변경 시 전체 FAQ 목록 애니메이션 */
`;

const FAQItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  &:last-child {
    border-bottom: none;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['4']};
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.white};
  transition: background-color 1s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['50']};
  }
  svg {
    margin-left: auto;
    color: ${({ theme }) => theme.colors.gray['500']};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    transition: transform 1s ease; /* 아이콘 회전 애니메이션 */
    ${(props) =>
      props.open &&
      css`
        transform: rotate(180deg);
      `}
  }
`;

const QuestionSymbol = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-right: ${({ theme }) => theme.spacing['3']};
  width: 24px;
  text-align: center; /* Q 심볼 가운데 정렬 */
`;

const QuestionText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  flex-grow: 1;
`;

const AnswerContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing['4']};
  background-color: ${({ theme }) => theme.colors.gray['200']};
  border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
  overflow: hidden; /* max-height 애니메이션을 위해 필수 */

  ${(props) =>
    props.open
      ? css`
          animation: ${slideDown} 0.4s ease-out forwards;
        `
      : css`
          /* 닫힐 때의 애니메이션은 보통 생략하거나 다른 방식으로 처리 (max-height 0으로 바로 변경) */
          max-height: 0;
          opacity: 0;
        `}
`;

const AnswerSymbol = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray['600']};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-right: ${({ theme }) => theme.spacing['3']};
  width: 24px;
  text-align: center; /* A 심볼 가운데 정렬 */
`;

const AnswerText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['700']};
  line-height: 1.6;
  flex-grow: 1;
`;

const NoFAQMessage = styled.div`
  padding: ${({ theme }) => theme.spacing['8']};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray['500']};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;
