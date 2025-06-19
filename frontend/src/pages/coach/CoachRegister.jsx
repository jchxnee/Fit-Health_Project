import React, { useState } from 'react';
import FieldSection from '../../components/CoachRegister/FieldSection.jsx';
import RegionSection from '../../components/CoachRegister/RegionSection.jsx';
import IdSection from '../../components/CoachRegister/IdSection.jsx';
import PriceDiscountSection from '../../components/CoachRegister/PriceDiscountSection.jsx';
import IntroSection from '../../components/CoachRegister/IntroSection.jsx';
import PhotoSection from '../../components/CoachRegister/PhotoSection.jsx';
import CareerSection from '../../components/CoachRegister/CareerSection.jsx';
import AgreementSection from '../../components/CoachRegister/AgreementSection.jsx';
import SubmitSection from '../../components/CoachRegister/SubmitSection.jsx';
import TitleBar from '../../components/TitleBar.jsx';
import styled from 'styled-components';

const MainContainer = styled.section`
  max-width: 1008px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;

  button {
    outline: none;
  }
`;

function CoachRegister() {
  const [photos, setPhotos] = useState([]);
  const [careers, setCareers] = useState([]);
  const [kakaoId, setKakaoId] = useState('');
  const [instaId, setInstaId] = useState('');
  const [price, setPrice] = useState('');
  const [discount3, setDiscount3] = useState('');
  const [discount5, setDiscount5] = useState('');
  const [discount10, setDiscount10] = useState('');
  const [intro, setIntro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('코치 등록이 완료됐습니다!');
  };

  return (
    <>
      <MainContainer>
        <TitleBar title="핏코치 등록" />
        <FieldSection />
        <RegionSection />
        <IdSection
          kakaoId={kakaoId}
          setKakaoId={setKakaoId}
          instaId={instaId}
          setInstaId={setInstaId}
        />
        <PriceDiscountSection
          price={price}
          setPrice={setPrice}
          discount3={discount3}
          setDiscount3={setDiscount3}
          discount5={discount5}
          setDiscount5={setDiscount5}
          discount10={discount10}
          setDiscount10={setDiscount10}
        />
        <IntroSection value={intro} onChange={setIntro} />
        <PhotoSection photos={photos} setPhotos={setPhotos} />
        <CareerSection careers={careers} setCareers={setCareers} />
        <AgreementSection />
        <SubmitSection onSubmit={handleSubmit} />
      </MainContainer>
    </>
  );
}

export default CoachRegister;
