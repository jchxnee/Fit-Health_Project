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

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/'; // 이 상수는 현재 코드에서 사용되지 않지만, 기존에 있었기에 유지합니다.

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
    loading, // 이 값들은 현재 컴포넌트에서 사용되지 않지만, useCoachRegisterForm 훅에서 제공되므로 유지합니다.
    error, // 이 값들은 현재 컴포넌트에서 사용되지 않지만, useCoachRegisterForm 훅에서 제공되므로 유지합니다.
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
      // ⭐ 수정 제안 시작
      // 백엔드에서 빈 문자열("")이 올 경우 `null`로 처리하여 `NumberFormatException`을 방지
      setPrice(data.oncePrice === '' ? null : data.oncePrice);
      setDiscount3(data.discount3 === '' ? null : data.discount3);
      setDiscount5(data.discount5 === '' ? null : data.discount5);
      setDiscount10(data.discount10 === '' ? null : data.discount10);
      // ⭐ 수정 제안 끝
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
      // originalData.current 에도 숫자 필드가 빈 문자열로 올 경우 null로 저장하여 비교 시 문제 방지
      originalData.current = {
        ...data,
        oncePrice: data.oncePrice === '' ? null : data.oncePrice,
        discount3: data.discount3 === '' ? null : data.discount3,
        discount5: data.discount5 === '' ? null : data.discount5,
        discount10: data.discount10 === '' ? null : data.discount10,
      };
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

    // ⭐ 수정 제안 시작
    // 숫자 필드에 빈 문자열이 들어올 경우 `null`로 처리하는 헬퍼 함수
    const getNumericValueForPatch = (value) => {
      // 입력값이 null이거나 undefined이거나 빈 문자열이면 null 반환,
      // 그 외에는 원래 값 반환. 이렇게 해야 백엔드에서 Long.valueOf(null) 또는 Long.valueOf("") 시도를 막을 수 있음.
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return value;
    };

    // 문자열 필드 비교
    if (majorName !== originalData.current?.majorName) changed.majorName = majorName;
    if (wishArea !== originalData.current?.wishArea) changed.wishArea = wishArea;
    if (kakaoId !== originalData.current?.kakaoId) changed.kakaoId = kakaoId;
    if (instaId !== originalData.current?.instaId) changed.instaId = instaId;
    if (intro !== originalData.current?.introduce) changed.introduce = intro;

    // 숫자 필드 비교 및 처리
    // `getNumericValueForPatch`를 사용하여 빈 문자열을 `null`로 변환 후 비교
    if (getNumericValueForPatch(price) !== getNumericValueForPatch(originalData.current?.oncePrice)) {
      changed.oncePrice = getNumericValueForPatch(price);
    }
    if (getNumericValueForPatch(discount3) !== getNumericValueForPatch(originalData.current?.discount3)) {
      changed.discount3 = getNumericValueForPatch(discount3);
    }
    if (getNumericValueForPatch(discount5) !== getNumericValueForPatch(originalData.current?.discount5)) {
      changed.discount5 = getNumericValueForPatch(discount5);
    }
    if (getNumericValueForPatch(discount10) !== getNumericValueForPatch(originalData.current?.discount10)) {
      changed.discount10 = getNumericValueForPatch(discount10);
    }
    // ⭐ 수정 제안 끝

    // JSON.stringify 비교는 배열이나 객체의 깊은 비교에 유용합니다.
    if (JSON.stringify(careers) !== JSON.stringify(originalData.current?.careers)) changed.careers = careers;

    // 사진 배열 비교 로직 (기존과 동일)
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
      // 성공적으로 수정된 후 originalData.current를 업데이트하여 다음 비교에 올바른 기준 제공
      // 여기서 changed에 null이 포함될 수 있으므로, originalData.current에 병합할 때 해당 값을 적용합니다.
      originalData.current = { ...originalData.current, ...changed };
      toast.success('코치 정보가 성공적으로 수정되었습니다!');
      navigate(`/coach/${trainerNo}`);
    } catch (err) {
      console.error('수정 실패:', err); // 디버깅을 위해 상세 에러 로그 출력
      toast.error('수정 실패: ' + (err?.response?.data?.message || '오류가 발생했습니다.'));
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
        <AgreementSection /> {/* 동의 섹션은 수정 로직에 직접적인 영향을 주지 않으므로 유지 */}
        <SubmitSection onSubmit={handleSubmit} />
      </MainContainer>
    </>
  );
}

export default CoachModify;
