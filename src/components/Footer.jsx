import React from 'react';
import styled from 'styled-components';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ theme }) => theme.width.xl};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} 0;
  box-sizing: border-box;
  margin-top: 50px;
  @media (max-width: ${({ theme }) => theme.width.sm}) {
    padding: ${({ theme }) => theme.spacing[6]} 0;
  }

  a,
  button {
    outline: none;
  }
`;

const FooterContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1008px;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.spacing[10]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[10]};

  @media (max-width: ${({ theme }) => theme.width.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 90%;
    margin-bottom: ${({ theme }) => theme.spacing[8]};
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 180px;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    min-width: unset;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

const CompanyInfoSection = styled(FooterSection)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    align-items: center;
  }
`;

const FooterLogo = styled.div`
  img {
    height: ${({ theme }) => theme.spacing[6]};
    margin-bottom: ${({ theme }) => theme.spacing[5]};
  }
`;

const FooterMenuGroup = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 2;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    text-align: center;
  }

  li:first-child {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.gray[800]};
    display: block;
  }

  li:not(:first-child) a {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    color: ${({ theme }) => theme.colors.gray[600]};
    text-decoration: none;
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }

  li a:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterCompanyGroup = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 2;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.width.md}) {
    justify-content: center;
  }

  li a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }

  li a:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContactSection = styled(FooterSection)`
  text-align: left;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    align-items: center;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ContactNumber = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing[2]};
`;

const ChatIcon = styled.img`
  height: ${({ theme }) => theme.spacing[5]};
  vertical-align: middle;
`;

const BusinessHours = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const FooterBottomWrapper = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-top: ${({ theme }) => theme.spacing[1]};
  width: 1008px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[5]};

  @media (max-width: ${({ theme }) => theme.width.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 90%;
  }
`;

const CompanyDetails = styled.div`
  flex-grow: 1;
  text-align: left;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    text-align: center;
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.gray[500]};
    margin: 3px 0;
    line-height: 1.6;
  }
`;

const SocialMediaIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[10]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.width.md}) {
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    margin-right: 0;
  }
`;

const IconWrapper = styled.a`
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.base};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};

  &.instagram-icon {
    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
    color: white;
  }

  &.youtube-icon {
    background-color: ${({ theme }) => theme.colors.white};
    color: #ff0000;
    font-size: 35px;
  }

  &.kakao-icon {
    background-color: #ffeb00;
    color: #191919;
    box-shadow: ${({ theme }) => theme.shadows.md};
    cursor: pointer;
    user-select: none;
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContentWrapper>
        <CompanyInfoSection>
          <FooterLogo>
            <img src="/public/img/Logo.png" alt="Fit:Health Logo" />
          </FooterLogo>
          <FooterCompanyGroup>
            <li>
              <Link to="/privacyPolicy">개인정보처리방침</Link>
            </li>
            <li>
              <Link to="/termOfService">이용약관</Link>
            </li>
            <li>
              <Link to="/operatingPolicy">운영정책</Link>
            </li>
          </FooterCompanyGroup>
        </CompanyInfoSection>

        <ContactSection>
          <ContactItem>
            <ContactNumber>1588-1955</ContactNumber>
            <ChatIcon src="/public/img/Chat.png" alt="Chat Icon" />
          </ContactItem>
          <BusinessHours>평일 09:00 ~ 18:00</BusinessHours>
          <BusinessHours>(점심시간 12:00 ~ 14:00 제외, 주말 공휴일 제외)</BusinessHours>
        </ContactSection>

        <FooterSection>
          <div style={{ display: 'flex', gap: '50px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <FooterMenuGroup>
              <li>회사</li>
              <li>
                <Link to="/introduce">회사소개</Link>
              </li>
              <li>
                <Link to="">채용안내</Link>
              </li>
            </FooterMenuGroup>
            <FooterMenuGroup>
              <li>고객센터</li>
              <li>
                <Link to="/notice">공지사항</Link>
              </li>
              <li>
                <Link to="/faqPage">자주묻는 질문</Link>
              </li>
            </FooterMenuGroup>
          </div>
        </FooterSection>
      </FooterContentWrapper>

      <FooterBottomWrapper>
        <CompanyDetails>
          <p>(주) Fit - GPT</p>
          <p>대표 김현아 | 사업자 번호 926-91-01283 | 직업정보제공사업 신고번호 J1523S0961029</p>
          <p>통신판매업 신고번호 2023-서울역삼-2091 호스팅 사업자 Amazon Web Service (AWS)</p>
          <p>
            주소 서울특별시 서울 강남구 테헤란로 14길 6 참조빌딩 11층 | 전화 1588-1955 | 고객문의
            cs@fithealthservice.com
          </p>
        </CompanyDetails>
        <SocialMediaIcons>
          <IconWrapper href="https://www.instagram.com/fit_health_0012/" className="instagram-icon">
            <FaInstagram />
          </IconWrapper>
          <IconWrapper href="https://www.youtube.com/@FIT-HEALTH-0012" className="youtube-icon">
            <FaYoutube />
          </IconWrapper>
          <IconWrapper href="http://pf.kakao.com/_JufJn/chat" className="kakao-icon">
            <RiKakaoTalkFill />
          </IconWrapper>
        </SocialMediaIcons>
      </FooterBottomWrapper>
    </FooterContainer>
  );
}
