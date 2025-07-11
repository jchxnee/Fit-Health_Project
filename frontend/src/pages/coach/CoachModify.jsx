import React, { useEffect, useRef } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';

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

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

function CoachModify() {
  const { trainerNo } = useParams();
  const navigate = useNavigate();
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
  } = useCoachRegisterForm();

  // 원본 데이터 저장용
  const originalData = useRef(null);

  useEffect(() => {
    if (!trainerNo || trainerNo === 'undefined') return;
    api.get(`/api/trainer/${trainerNo}`).then((res) => {
      const data = res.data;
      setMajorName(data.majorName || '');
      setWishArea(data.wishArea || '');
      setKakaoId(data.kakaoId || '');
      setInstaId(data.instaId || '');
      setPrice(data.oncePrice || '');
      setDiscount3(data.discount3 || '');
      setDiscount5(data.discount5 || '');
      setDiscount10(data.discount10 || '');
      setIntro(data.introduce || '');
      setCareers(data.careers || []);
      setPhotos(
        (data.trainerPhoto || []).map((photo) => ({
          file: null,
          preview: photo.changeName,
          uploadedFileName: photo.changeName,
          originName: photo.originName,
        }))
      );
      originalData.current = data;
    });
  }, [trainerNo]);

  // 변경된 값만 PATCH로 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trainerNo || trainerNo === 'undefined') {
      toast.error('트레이너 번호가 올바르지 않습니다.');
      return;
    }
    const changed = {};
    if (majorName !== originalData.current?.majorName) changed.majorName = majorName;
    if (wishArea !== originalData.current?.wishArea) changed.wishArea = wishArea;
    if (kakaoId !== originalData.current?.kakaoId) changed.kakaoId = kakaoId;
    if (instaId !== originalData.current?.instaId) changed.instaId = instaId;
    if (intro !== originalData.current?.introduce) changed.introduce = intro;
    if (String(price) !== String(originalData.current?.oncePrice)) changed.oncePrice = price;
    if (String(discount3) !== String(originalData.current?.discount3)) changed.discount3 = discount3;
    if (String(discount5) !== String(originalData.current?.discount5)) changed.discount5 = discount5;
    if (String(discount10) !== String(originalData.current?.discount10)) changed.discount10 = discount10;
    if (JSON.stringify(careers) !== JSON.stringify(originalData.current?.careers)) changed.careers = careers;
    if (
      JSON.stringify(
        photos.map((p) => ({ originName: p.originName, changeName: p.uploadedFileName || p.changeName }))
      ) !==
      JSON.stringify(
        (originalData.current?.trainerPhoto || []).map((p) => ({ originName: p.originName, changeName: p.changeName }))
      )
    ) {
      changed.trainerPhoto = photos
        .map((p) => ({
          originName: p.originName,
          changeName: p.uploadedFileName || p.changeName,
        }))
        .filter((p) => p.originName && p.changeName);
    }
    if (Object.keys(changed).length === 0) {
      toast.error('변경된 내용이 없습니다.');
      return;
    }
    try {
      await api.patch(`/api/trainer/${trainerNo}`, changed);
      originalData.current = { ...originalData.current, ...changed };
      toast.success('코치 정보가 성공적으로 수정되었습니다!');
      navigate(`/coach/${trainerNo}`);
    } catch (err) {
      toast.error('수정 실패: ' + (err?.response?.data?.message || '오류'));
    }
  };

  return (
    <>
      <MainContainer>
        <TitleBar title="핏코치 수정" />
        <FieldSection majorName={majorName} setMajorName={setMajorName} />
        <RegionSection value={wishArea} onChange={setWishArea} />
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

export default CoachModify;
