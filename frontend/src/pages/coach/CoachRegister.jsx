import React from 'react';
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
import useCoachRegisterForm from '../../hooks/coach/Form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore.js';

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
    photos,
    setPhotos,
    careers,
    setCareers,
    kakaoId,
    setKakaoId,
    instaId,
    setInstaId,
    price,
    setPrice,
    discount3,
    setDiscount3,
    discount5,
    setDiscount5,
    discount10,
    setDiscount10,
    intro,
    setIntro,
    majorName,
    setMajorName,
    wishArea,
    setWishArea,
    loading,
    error,
    submitForm,
  } = useCoachRegisterForm();

  const navigate = useNavigate();
  const updateUser = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitForm();
    if (ok !== 0) {
      toast.success('코치 등록이 완료됐습니다!');
      updateUser({ trainerNo: ok });
      navigate('/coachList');
    } else {
      toast.error('등록 실패: ' + (error?.message || '오류'));
    }
  };

  return (
    <>
      <MainContainer>
        <TitleBar title="핏코치 등록" />
        <FieldSection majorName={majorName} setMajorName={setMajorName} />
        <RegionSection wishArea={wishArea} setWishArea={setWishArea} />
        <IdSection kakaoId={kakaoId} setKakaoId={setKakaoId} instaId={instaId} setInstaId={setInstaId} />
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
