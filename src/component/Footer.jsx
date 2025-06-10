import React from 'react';
import '../style/Footer.css'

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section company-info-section">
                    <div className="footer-logo">
                        <img src= "/public/img/Logo.png" alt="Fit:Health Logo" /> {/* Replace with your logo path */}
                    </div>
                    <ul className="footer-links-group">
                        <li><a href="#privacy">개인정보처리방침</a></li>
                        <li><a href="#terms">이용약관</a></li>
                        <li><a href="#policy">운영정책</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-section">
                    <div className="contact-item">
                        <span className="contact-number">1588-1955</span>
                        <img src="/public/img/Chat.png" alt="Chat Icon" className="chat-icon" /> {/* Replace with your chat icon path */}
                    </div>
                    <p className="business-hours">평일 09:00 ~ 18:00</p>
                    <p className="lunch-break">(점심시간 12:00 ~ 14:00 제외, 주말 공휴일 제외)</p>
                </div>

                <div className="footer-section navigation-section">
                    <ul className="footer-links-group">
                        <li><a href="#company">회사</a></li>
                        <li><a href="#customer-instroduce">회사소개</a></li>
                        <li><a href="#careers">채용안내</a></li>
                    </ul>
                    <ul className="footer-links-group">
                        <li><a href="#company-center">고객센터</a></li>
                        <li><a href="#board">공지사항</a></li>
                        <li><a href="#faq">자주묻는 질문</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="company-details">
                    <p>(주) Fit - GPT</p>
                    <p>대표 김현아 | 사업자 번호 926-91-01283 | 직업정보제공사업 신고번호 J1523S0961029</p>
                    <p>통신판매업 신고번호 2023-서울역삼-2091 호스팅 사업자 Amazon Web Service (AWS)</p>
                    <p>주소 서울특별시 서울 강남구 테헤란로 14길 6 참조빌딩 11층 | 전화 1588-1955 | 고객문의 cs@fithealthservice.com</p>
                </div>
                <div className="social-media-icons">
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/public/img/instagram.png" alt="Instagram" /> {/* Replace with your Instagram icon path */}
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <img src="/public/img/youtube.png" alt="YouTube" /> {/* Replace with your YouTube icon path */}
                    </a>
                    <a href="https://www.kakaotalk.com" target="_blank" rel="noopener noreferrer">
                        <img src="/public/img/youtube2.png" alt="KakaoTalk" /> {/* Replace with your KakaoTalk icon path */}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;