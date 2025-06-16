import React from 'react';
import {
  Article,
  ArticleHeading,
  ContentWrapper,
  Paragraph,
  RecommendedExerciseWrapper,
  Section,
  SectionHeading,
} from '../../styles/common/Service';

import TitleBar from '../../components/TitleBar';

const TermOfServicePage = () => {
  return (
    <ContentWrapper>
      <TitleBar title={'이용약관'} />
      <RecommendedExerciseWrapper>
        <Section>
          <SectionHeading>회사 주식회사 FIT-GPT 이용약관</SectionHeading>

          <Article>
            <ArticleHeading>제1조 목적</ArticleHeading>
            <Paragraph>
              이 약관은 주식회사 FIT-GPT(이하 “회사”)이 제공하는 FIT:HEALTH 플랫폼을 통해 회원에게 제공되는 건강 정보
              관리, 운동 코칭 매칭, 상품 구매 등 다양한 서비스의 이용조건 및 절차, 권리·의무 등을 규정함을 목적으로
              합니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제2조 정의</ArticleHeading>
            <Paragraph>
              1. “회원”이란 본 약관에 동의하여 회사와 이용계약을 체결하고 이용하는 자를 말합니다.
              <br />
              2. “코치”란 플랫폼에 등록하여 회원에게 운동 지도를 제공하는 자를 말합니다.
              <br />
              3. “서비스”란 건강 정보 등록, 맞춤 코칭, 실시간 상담, 상품 구매 등 회사가 제공하는 일체의 서비스를
              의미합니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제3조 이용계약의 성립</ArticleHeading>
            <Paragraph>
              회원은 본 약관에 동의함으로써 이용계약이 성립하며, 일부 기능은 실명인증 및 건강정보 입력이 필요할 수
              있습니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제4조 서비스의 내용</ArticleHeading>
            <Paragraph>
              1. 건강 정보 등록 및 관리
              <br />
              2. 코치-회원 간 자동 매칭 및 실시간 채팅
              <br />
              3. 출장 PT 서비스의 위치 기반 제공
              <br />
              4. 건강기능식품, 운동용품, 식사대용식 등의 상품 판매
              <br />
              5. 건강 정보 기반의 운동 프로그램 추천
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제5조 회원의 의무</ArticleHeading>
            <Paragraph>
              1. 타인의 정보를 도용하거나 허위 정보를 입력하지 않아야 합니다.
              <br />
              2. 건강 상태, 병력 등 필수 정보를 정확히 입력해야 하며, 회사는 이를 바탕으로 추천 서비스를 제공합니다.
              <br />
              3. 회사의 지적재산권 및 운영 질서를 침해하는 행위를 해서는 안 됩니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제6조 회사의 권리 및 의무</ArticleHeading>
            <Paragraph>
              1. 서비스 운영과 관련된 모든 권리는 회사에 있으며, 정기적 업데이트를 통해 서비스 품질을 유지합니다.
              <br />
              2. 회원의 건강 정보를 바탕으로 개인화된 추천 서비스를 제공합니다.
              <br />
              3. 코치의 신뢰성 확보를 위해 등록 요건 및 평판 시스템을 운영합니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제7조 결제 및 환불</ArticleHeading>
            <Paragraph>
              1. 상품 결제는 외부 결제 시스템을 통해 이루어지며, 결제 내역은 마이페이지에서 확인할 수 있습니다.
              <br />
              2. 상품 환불 및 코칭 서비스 취소는 별도 환불 정책에 따릅니다.
              <br />
              3. 코칭 서비스는 일정 시간 이전 취소 시 전액 환불이 가능하며, 이후는 환불이 제한될 수 있습니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제8조 개인정보 보호</ArticleHeading>
            <Paragraph>
              회사는 『개인정보 보호법』에 따라 회원의 개인정보를 보호하며, 자세한 내용은 별도의 『개인정보처리방침』을
              따릅니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제9조 면책조항</ArticleHeading>
            <Paragraph>
              1. 회사는 회원의 건강 상태 변화나 개인적인 운동 결과에 대해 의학적 책임을 지지 않습니다.
              <br />
              2. 코칭 서비스의 효과는 개인차가 있으며, 의학적 처방을 대체하지 않습니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제10조 약관의 변경</ArticleHeading>
            <Paragraph>
              회사는 본 약관을 사전 고지 후 변경할 수 있으며, 변경된 약관은 공지일로부터 효력이 발생합니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>부칙</ArticleHeading>
            <Paragraph>본 약관은 2025년 7월 18일부터 시행됩니다.</Paragraph>
          </Article>
        </Section>
      </RecommendedExerciseWrapper>
    </ContentWrapper>
  );
};

export default TermOfServicePage;
