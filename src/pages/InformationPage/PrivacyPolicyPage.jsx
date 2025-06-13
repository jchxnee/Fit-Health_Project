import React from 'react';

import styled from 'styled-components';
import {
  Article,
  ContentWrapper,
  Paragraph,
  PolicyTable,
  RecommendedExerciseWrapper,
  Section,
  TableData,
  TableHeader,
} from '../../styles/common/Service';

import TitleBar from '../../components/TitleBar';

const PrivacyPolicyPage = () => {
  return (
    <ContentWrapper>
      <TitleBar title={'개인정보 처리방침'} />
      <RecommendedExerciseWrapper>
        <Section>
          <Article>
            <Paragraph>&lt;일반회원&gt;</Paragraph>
            <OperatingPolicyTable>
              <thead>
                <tr>
                  <TableHeader>수집 및 이용 목적</TableHeader>
                  <TableHeader>필수/선택</TableHeader>
                  <TableHeader>수집 항목</TableHeader>
                  <TableHeader>보유기간</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>회원가입(이메일)</TableData>
                  <TableData rowSpan="6">필수</TableData>
                  <TableData>성명, 닉네임, 이메일 주소, 비밀번호</TableData>
                  <TableData rowSpan="4">
                    회원 탈퇴시까지 <br /> 단, 관계법령에 별도로 정하고 있는 경우 그에 따른 법정기간 동안 보관
                  </TableData>
                </tr>
                <tr>
                  <TableData>회원가입(네이버, 카카오)</TableData>
                  <TableData>성명, 닉네임, 이메일 주소, 휴대 전화번호, 네이버 또는 카카오 프로필 이미지</TableData>
                </tr>
                <tr>
                  <TableData>회원가입(애플)</TableData>

                  <TableData>성명, 닉네임, 이메일 주소, 휴대 전화번호</TableData>
                </tr>
                <tr>
                  <TableData>본인 확인 및 중복 가입 방지</TableData>
                  <TableData>
                    성명, 휴대전화번호, 통신사, 중복가입정보(DI), 단말기 정보(단말기명, OS, 앱 버전), 서비스 이용
                    기록(접속로그, IP, 쿠키), 채팅 내역, 불량 이용 기록
                  </TableData>{' '}
                </tr>
                <tr>
                  <TableData>
                    회원 탈퇴 시, 탈퇴 이후 서비스 혼선 방지, 수사기관에 대한 협조, 불량 회원의 부정한 이용의 재발 및
                    재가입 방지, 분쟁 해결
                  </TableData>
                  <TableData>
                    성명, 닉네임, 이메일 주소, 휴대 전화번호, 중복가입정보(DI), 단말기 정보(단말기명, OS), 쿠키, 채팅
                    내역, 결제 기록, 불량 이용 기록, 요청 내역
                  </TableData>{' '}
                  <TableData>
                    회원 탈퇴일(이용계약 해지일)로부터 1년.
                    <br />
                    단, 관계법령에 별도로 정하고 있는 경우 그에 따른 법정기간 동안 보관
                  </TableData>
                </tr>
                <tr>
                  <TableData>상담 내용 기록 및 분쟁 해결</TableData>
                  <TableData>
                    상담 이력 및 녹취, 휴대 전화번호, 이메일 주소, 안심 번호 서비스 이용 기록(음성 녹취)
                  </TableData>
                  <TableData>
                    회원 탈퇴 시까지
                    <br />
                    단, 전자거래상거래 등에서의 소비자보호에 관한 법률 제6조 및 동법시행령 제 6조 제1항 제4호에 의거하여
                    3년간 보관 후 파기
                  </TableData>
                </tr>
              </tbody>
            </OperatingPolicyTable>
          </Article>
        </Section>
      </RecommendedExerciseWrapper>
    </ContentWrapper>
  );
};

export default PrivacyPolicyPage;

export const OperatingPolicyTable = styled(PolicyTable)`
  width: 100%;
`;
