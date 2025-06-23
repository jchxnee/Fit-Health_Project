import React from 'react';
import TitleBar from '../../components/TitleBar.jsx';
import styled from 'styled-components';
import useCoachRegisterForm from '../../hooks/coach/Form';
import FieldSection from '../../components/CoachModify/FieldSection.jsx';
import RegionSection from '../../components/CoachModify/RegionSection.jsx';
import IdSection from '../../components/CoachModify/IdSection.jsx';
import PriceDiscountSection from '../../components/CoachModify/PriceDiscountSection.jsx';
import IntroSection from '../../components/CoachModify/IntroSection.jsx';
import PhotoSection from '../../components/CoachModify/PhotoSection.jsx';
import CareerSection from '../../components/CoachModify/CareerSection.jsx';
import AgreementSection from '../../components/CoachModify/AgreementSection.jsx';
import SubmitSection from '../../components/CoachModify/SubmitSection.jsx';

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
  const {
    photos, setPhotos,
    careers, setCareers,
    kakaoId, setKakaoId,
    instaId, setInstaId,
    price, setPrice,
    discount3, setDiscount3,
    discount5, setDiscount5,
    discount10, setDiscount10,
    intro, setIntro,
    majorName, setMajorName,
    wishArea, setWishArea,
    loading, error,
    submitForm,
  } = useCoachRegisterForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitForm();
    if (ok) {
      alert('코치 수정이 완료됐습니다!');
    } else {
      alert('수정 실패: ' + (error?.message || '오류'));
    }
  };

  return (
    <>
      <MainContainer>
        <TitleBar title="핏코치 수정" />
        <FieldSection majorName={majorName} setMajorName={setMajorName} />
        <RegionSection wishArea={wishArea} setWishArea={setWishArea} />
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
