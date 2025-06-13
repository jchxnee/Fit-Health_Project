import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TitleBar from '../../components/TitleBar';
import betaImg from '../../assets/beta_user_img.png'; // Header에서 사용될 이미지 (경로에 맞게 수정)

function NoticeDetailPage() {
  const [user] = useState({ name: '김현아', img: betaImg }); // Header에 전달할 사용자 정보

  // 더미 데이터 (실제로는 API 호출 등을 통해 특정 공지사항의 데이터를 받아옴)
  const noticeDetail = {
    id: 1,
    title: '받은견적 ‘최상단 고정 광고‘ 시범 운영',
    date: '2025.06.02',
    content: `안녕하세요, 숨고입니다.

지난 10년간 ‘고객과 고수를 연결한다’는 가치를 바탕으로, 

고수님과 고객님께 더 나은 경험을 제공하기 위해 꾸준히 노력해왔습니다.

그 과정에서 다양한 인터뷰와 설문을 통해 많은 고수님들께서 “고객에게 내 견적을 더 눈에 띄게 보여줄 수 없을까?”라는 의견을 반복적으로 전해주셨습니다. 

이를 통해, 더 많은 고객에게 스스로를 효과적으로 마케팅할 수 있는 방법에 대한 고수님들의 필요를 확인할 수 있었습니다.

이러한 고수님의 의견을 바탕으로, 일부 지역과 서비스를 대상으로 오는 6월 19일부터 '최상단 고정 광고'를 시범 운영합니다. 

고수님께 더 나은 마케팅 기회를 제공하고자 기획되었으며, 안정적인 시범 운영 후 점진적으로 전국 및 모든 서비스로 확대할 예정입니다.

 



 

📌 최상단 고정 광고란?

고수님이 견적을 보내실 때마다, 해당 고객의 '받은견적' 화면 최상단에 고수님의 견적서가 고정 노출되는 디스플레이형 광고입니다. 

고객이 견적서를 확인할 때 최상단에서 가장 먼저 보이기 때문에, 주목도가 높아 고용 가능성을 높일 수 있어요.

 

🎯 주요 특징

(1) 고객을 사로잡는 시선 집중 효과

고객의 '받은견적' 화면 최상단에 견적이 고정 노출되고

견적 목록에도 한 번 더 노출되어 두 번의 시선 집중 효과가 있습니다.

(2) 비즈니스 성장에 맞춘 전략적 마케팅

신규 서비스 론칭, 특정 지역 공략, 성수기와 비수기 고객 확보 등

비즈니스 전략에 맞춰 고수님이 선택해 운영할 수 있습니다.

(3) 고수님이 직접 선택하는 공정하고 자율적인 광고 시스템

고수님이 직접 원하는 지역과 서비스를 선택하고, 광고 희망 금액을 결정해 입찰에 참가하는 방식입니다. 모든 고수님께 동등한 기회가 주어지며, 낙찰 광고 금액은 공정한 시장 원리에 따라 결정됩니다. 

숨고는 각 지역·서비스별 수요, 경쟁 상황, 특성 등을 종합적으로 고려해 최소 입찰가를 안내합니다.

 



 

광고 상품 개요

광고명 : 최상단 고정 광고
운영 방식 : 2주 단위 운영 / 입찰 방식
광고 구좌 : 지역 X 서비스 기준 1개 구좌, 1인 낙찰
광고 지역 : 서울, 경기, 인천, 부산, 김해, 양산 
광고 대상 : 숨고 주요 서비스 74개 ▶  광고 서비스 확인하기
광고 노출 : 낙찰된 지역·서비스에 견적서를 보낼 경우 자동으로 최상단 노출
광고 기간 : 낙찰 발표 다음 주 월요일 00시 00분 ~ 일요일 23시 59분 (2주간 노출)
낙찰 기준 : 최고 입찰가 낙찰 (동일 금액 시, 선착순 낙찰)
입찰 가능 광고 구좌수 : 제한 없이 가능
광고 1구좌당 재입찰 가능 횟수: 최대 20회까지 재입찰 가능
입찰가 확인 : 본인 입찰가만 확인 가능 (타인 정보 비공개)
비용 부과 : 낙찰된 경우에만 광고비 자동 결제 (낙찰 실패시, 결제되지 않음)


 

광고 입찰 일정

광고 입찰은 2주 단위로 운영되며, 격주 목요일 오전 9시에 신청 가능합니다.

마이페이지 내 '광고' 메뉴를 통하거나, 고수 홈화면의 상단 '최상단 고정광고 도전하기'를 통해 신청하세요.

1회차 광고

- 입찰 기간 : 6/19(목) 오전 9시 ~ 6/26(목) 오전 8시 59분

- 낙찰 발표 : 6/26(목) 낮 12시부터 순차 발표

- 광고 기간 : 6/30(월) 00시 ~ 7/13(일) 23시 59분

2회차 광고

- 입찰 기간 : 6/26(목) 오전 9시 ~ 7/10(목) 오전 8시 59분

- 낙찰 발표 : 7/10(목) 낮 12시부터 순차 발표

- 광고 기간 : 7/14(월) 00시 ~ 7/27(일) 23시 59분

3회차 광고

- 입찰 기간 : 7/10(목) 오전 9시 ~ 7/24(목) 오전 8시 59분

- 낙찰 발표 : 7/24(목) 낮 12시부터 순차 발표

- 광고 기간 : 7/28(월) 00시 ~ 8/10(일) 23시 59분

4회차 광고

- 입찰 기간 : 7/24(목) 오전 9시 ~ 8/07(목) 오전 8시 59분

- 낙찰 발표 : 8/07(목) 낮 12시부터 순차 발표

- 광고 기간 : 8/11(월) 00시 ~ 8/24(일) 23시 59분

※5회차 이후에는 이전 회차와 동일한 일정으로, 격주 목요일 오전 9시 기준으로 입찰 신청이 운영됩니다.

 



 

 

광고 입찰 방법과 추천 대상을 확인하세요!

🎯최상단 고정 광고 더 알아보기

 



 

입찰 참가 전 꼭 확인하세요

- 모든 고수님의 공정한 입찰 참가 및 원활한 광고 서비스 운영을 위해 입찰을 취소할 수 없습니다.

- 광고는 낙찰된 서비스와 지역에, 고수님이 바로견적 또는 기본견적을 발송할 때 자동 노출됩니다.

- 광고비는 낙찰된 고수님만 자동 결제되며, 낙찰되지 않으면 비용이 결제되지 않습니다.

- 낙찰자의 카드 결제가 실패한 경우, 다음 순위 입찰자에게 낙찰 기회가 넘어갑니다.

- 동일한 입찰가가 복수 접수된 경우, 가장 먼저 입찰에 참가한 고수님이 낙찰됩니다.

- 광고 구좌 입찰에 단 한 명만 참가한 경우에도, 입찰은 유효하며 그 고수님이 자동 낙찰됩니다.

- 입찰 참가 후 취소 및 낙찰 시 자동결제에 대한 환불이 불가하므로, 금액과 결제수단을 신중히 고려하신 후 입찰에 참가해 주세요.

- 광고 구좌당 재입찰 가능 횟수는 최대 20회입니다.

- 입찰 금액은 동일 광고 구좌에 재입찰을 통해 변경하실 수 있습니다.

- 고수님의 귀책으로 활동하지 않는 지역·서비스 구좌의 입찰에 참가하신 경우, 이를 이유로 하는 입찰 취소 또는 자동결제에 대한 환불은 불가합니다.

- 반드시 활동 지역·서비스에 맞는 광고 구좌를 선택해 주세요.

 

고수님의 비즈니스에 도움이 되는 전략적 마케팅 도구로 적극 활용해 보시길 바랍니다.

앞으로도 고수님의 마케팅 활동에 실질적인 도움이 될 수 있도록, 지속적으로 개선해 나가겠습니다.

 

(25년 5월 29일 작성)

Facebook Twitter LinkedIn`, //
  };

  return (
    <>
      <PageContainer>
        <Header user={user} />
        <TitleBar title="공지사항" />
        <ContentWrapper>
          <NoticeDetailContainer>
            <NoticeTitle>{noticeDetail.title}</NoticeTitle>
            <NoticeDate>{noticeDetail.date}</NoticeDate>
            <NoticeContentLine />
            <NoticeContentText>{noticeDetail.content}</NoticeContentText>
            <ButtonWrapper>
              <ToListButton>목록으로</ToListButton>
            </ButtonWrapper>
          </NoticeDetailContainer>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
}

export default NoticeDetailPage;

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
  margin-top: ${({ theme }) => theme.spacing['6']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
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
  text-align: left; /* 이미지와 일치 */
`;

const NoticeDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray['500']};
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  text-align: left; /* 이미지와 일치 */
`;

const NoticeContentLine = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray['300']}; /* 이미지의 구분선 */
  margin-bottom: ${({ theme }) => theme.spacing['6']}; /* 내용과의 간격 */
`;

const NoticeContentText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['700']};
  line-height: 1.8;
  white-space: pre-wrap; /* 줄바꿈을 유지 */
  margin-bottom: ${({ theme }) => theme.spacing['20']}; /* 버튼과의 간격 */
  text-align: left; /* 이미지와 일치 */
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing['6']};
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
