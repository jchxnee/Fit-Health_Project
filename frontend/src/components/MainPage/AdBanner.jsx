import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

// Wrapper for full width centering
const BannerWrapper = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
    background: ${({ theme }) => theme.colors.white || '#fff'};
`;

// Main banner container (visible buttons, overflow allowed)
const Banner = styled.div`
    width: 900px;
    height: 140px;
    background: #e8f2ff;
    border-radius: ${({ theme }) => theme.borderRadius?.['2xl'] || '20px'};
    position: relative;
    margin: ${({ theme }) => theme.spacing?.[10] || '40px'} 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Slide area with overflow hidden to clip neighboring slides
const SlideContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.borderRadius?.['2xl'] || '20px'};
`;

// Slide wrapper for transform animation
const SlideTrack = styled.div`
    display: flex;
    height: 100%;
    transition: transform 0.5s ease-in-out;
    transform: ${({ $currentIndex }) => `translateX(-${900 * $currentIndex}px)`};
`;

// Individual slide
const SlideItem = styled.div`
    min-width: 900px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    box-sizing: border-box;

    img {
        height: 100%;
        object-fit: contain;
    }

    .text-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: 'SUITE', sans-serif;

        .title {
            font-size: 18px;
            font-weight: 500;
            color: #333;
        }

        .highlight {
            font-size: 24px;
            font-weight: 700;
            color: #4f00ff;
            margin-top: 4px;
        }
    }
`;

// Navigation arrow base
const Arrow = styled.button`
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    border: none;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #666;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
`;

// Positioning arrows slightly outside
const PrevButton = styled(Arrow)`
    left: -24px;
`;
const NextButton = styled(Arrow)`
    right: -24px;
`;

// Slide index indicator
const IndexIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  background: #888888aa;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
`;

const AdBanner = () => {
    const mainImg = [
        {
            text1: '최대 500만원 이벤트',
            text2: '당첨자를 발표합니다',
            url: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnT1Ur%2FbtsNKrWtSZF%2FKejwG76548YbGvRPueLfik%2Fimg.webp',
        },
        {
            text1: '헬스케어 구독 혜택',
            text2: '첫 달 무료!',
            url: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FPOVzE%2FbtsNKtGKk3E%2Fs90KumqyLjmCCpOj3Nt4Q1%2Fimg.webp',
        },
        {
            text1: '여름 한정 할인',
            text2: '회원만 50% 혜택',
            url: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fd2IfG9%2FbtsNKztmlww%2FKzOl2ZCfrK7WVZnsJGX68k%2Fimg.webp',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = mainImg.length;
    const intervalRef = useRef(null);

    const goToNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
    const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

    useEffect(() => {
        intervalRef.current = setInterval(goToNext, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const pauseAutoSlide = () => clearInterval(intervalRef.current);
    const resumeAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(goToNext, 3000);
    };

    return (
        <BannerWrapper>
            <Banner onMouseEnter={pauseAutoSlide} onMouseLeave={resumeAutoSlide}>
                <PrevButton onClick={goToPrev}><GoChevronLeft /></PrevButton>

                <SlideContainer>
                    <SlideTrack $currentIndex={currentIndex}>
                        {mainImg.map((item, idx) => (
                            <SlideItem key={idx}>
                                <div className="text-box">
                                    <div className="title">{item.text1}</div>
                                    <div className="highlight">{item.text2}</div>
                                </div>
                                <img src={item.url} alt={`배너 ${idx + 1}`} />
                            </SlideItem>
                        ))}
                    </SlideTrack>
                </SlideContainer>

                <NextButton onClick={goToNext}><GoChevronRight /></NextButton>
                <IndexIndicator>{`${currentIndex + 1}/${totalSlides}`}</IndexIndicator>
            </Banner>
        </BannerWrapper>
    );
};

export default AdBanner;
