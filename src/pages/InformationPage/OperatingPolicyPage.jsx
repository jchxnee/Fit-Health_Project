import React from 'react';
import {
  Article,
  ArticleHeading,
  ContentWrapper,
  Paragraph,
  PolicyTable,
  RecommendedExerciseWrapper,
  Section,
  SectionHeading,
  TableData,
  TableHeader,
} from '../../styles/common/Service';

import TitleBar from '../../components/TitleBar';

const OperatingPolicyPage = () => {
  return (
    <ContentWrapper>
      <TitleBar title={'이용약관'} />
      <RecommendedExerciseWrapper>
        <Section>
          <SectionHeading>회사 주식회사 FIT-GPT 이용약관</SectionHeading>

          <Article>
            <Paragraph>
              FIT:HEALTH는 고객과 코치 모두가 안심하고 사용할 수 있는 건강 코칭 및 쇼핑 플랫폼을 운영하기 위해 다음과
              같은 운영정책을 수립합니다. 본 정책은 서비스 이용약관을 보완하며, 구체적인 운영 기준을 안내합니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제1조 회원의 기본 의무</ArticleHeading>
            <Paragraph>
              1. 회원은 실명 및 본인 정보를 정확히 입력해야 합니다.
              <br />
              2. 서비스 내에서 허위 정보, 비방, 욕설, 음란물, 정치·종교 선동 등을 게시해서는 안 됩니다.
              <br />
              3. 타인의 개인정보나 건강정보를 무단 수집하거나 도용해서는 안 됩니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제2조 코치 등록 및 활동 기준</ArticleHeading>
            <Paragraph>
              1. 코치는 전문 자격 또는 경력을 증빙해야 하며, 회사는 이를 검토 후 등록을 승인합니다.
              <br />
              2. 코치는 고객과의 상담 및 방문 시 친절하고 책임감 있는 태도를 유지해야 합니다.
              <br />
              3. 코치가 반복적으로 약속을 어기거나 고객 민원이 접수될 경우 경고 또는 활동 정지될 수 있습니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제3조 건강정보 및 추천 서비스 운영</ArticleHeading>
            <Paragraph>
              회원은 본 약관에 동의함으로써 이용계약이 성립하며, 일부 기능은 실명인증 및 건강정보 입력이 필요할 수
              있습니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제4조 채팅 및 상담 이용 규칙</ArticleHeading>
            <Paragraph>
              1. 실시간 채팅은 오직 건강/운동 코칭 목적에 한해 사용해야 합니다.
              <br />
              2. 상담 중 욕설, 성희롱, 광고, 외부 연락처 공유 등은 엄격히 금지됩니다.
              <br />
              3. 신고 접수 시 즉시 채팅 내용 검토 후, 경고, 이용 제한 등의 조치가 취해집니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제5조 결제, 환불 및 분쟁 처리</ArticleHeading>
            <Paragraph>
              1. 모든 유료 서비스 및 상품은 회사의 결제 시스템을 통해 결제해야 하며, 외부 거래는 금지됩니다.
              <br />
              2. 코칭 서비스 취소는 예약 시간 기준 24시간 전까지 가능하며, 이후에는 부분 환불 또는 환불 불가 처리됩니다.
              <br />
              3. 고객 또는 코치 간 분쟁 발생 시, 회사는 중립적인 입장에서 사실을 확인하고 합리적 기준에 따라 중재합니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제6조 제재 및 이용 제한 정책</ArticleHeading>
            <PolicyTable>
              <thead>
                <tr>
                  <TableHeader>위반행위 유형</TableHeader>
                  <TableHeader>제재 내용</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>허위 정보 등록</TableData>
                  <TableData>1차 경고 &gt; 반복 시 이용 제한</TableData>
                </tr>
                <tr>
                  <TableData>욕설, 성희롱, 불법 행위</TableData>
                  <TableData>즉시 서비스 이용 정지 또는 영구 탈퇴 조치</TableData>
                </tr>
                <tr>
                  <TableData>외부 결제 유도, 직거래 시도</TableData>
                  <TableData>계정 정지 및 민·형사상 책임 부과 가능</TableData>
                </tr>
                <tr>
                  <TableData>반복 민원 및 부적절 활동</TableData>
                  <TableData>회사 내부 심사를 통해 활동 제한 가능</TableData>
                </tr>
              </tbody>
            </PolicyTable>
          </Article>

          <Article>
            <ArticleHeading>제7조 게시물 운영 정책</ArticleHeading>
            <Paragraph>
              1. 플랫폼 내 게시물(후기, Q&A 등)은 누구나 열람할 수 있으며, 불법, 욕설, 광고성 게시물은 사전 통보 없이
              삭제됩니다.
              <br />
              2. 작성자는 본인의 게시물에 대해 삭제 요청 가능하며, 삭제된 게시물은 복구되지 않습니다.
            </Paragraph>
          </Article>

          <Article>
            <ArticleHeading>제8조 정책 변경 및 공지</ArticleHeading>
            <Paragraph>
              운영정책은 회사의 내부 사정 또는 관련 법령에 따라 변경될 수 있으며, 변경 시 최소 7일 전 공지됩니다.
            </Paragraph>
          </Article>

          <Article>
            <Paragraph>⦁ 시행일: 2025년 07월 18일</Paragraph>
          </Article>
        </Section>
      </RecommendedExerciseWrapper>
    </ContentWrapper>
  );
};

export default OperatingPolicyPage;
