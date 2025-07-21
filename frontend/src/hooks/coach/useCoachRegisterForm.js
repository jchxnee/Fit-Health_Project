import { useState } from 'react';
import axios from 'axios';
import useUserStore from '../../store/useUserStore';

export default function useCoachRegisterForm() {
  const { user } = useUserStore();
  const userEmail = user?.email || '';
  const [photos, setPhotos] = useState([]);
  const [careers, setCareers] = useState([]);
  const [kakaoId, setKakaoId] = useState('');
  const [instaId, setInstaId] = useState('');
  const [price, setPrice] = useState('');
  const [discount3, setDiscount3] = useState('');
  const [discount5, setDiscount5] = useState('');
  const [discount10, setDiscount10] = useState('');
  const [intro, setIntro] = useState('');
  const [majorName, setMajorName] = useState('');
  const [wishArea, setWishArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 실제 등록 요청 함수
  const submitForm = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('userEmail', userEmail); // 사용자 이메일 추가
      formData.append('majorName', majorName);
      formData.append('wishArea', wishArea);
      formData.append('kakaoId', kakaoId);
      formData.append('instaId', instaId);
      formData.append('oncePrice', price);
      formData.append('discount3', discount3);
      formData.append('discount5', discount5);
      formData.append('discount10', discount10);
      formData.append('introduce', intro);
      careers.forEach((career, idx) => formData.append(`careers[${idx}]`, career));
      photos.forEach((photo) => formData.append('files', photo.file));

      const data = await axios.post('https://fit-health.store/api/trainer/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      return false;
    }
  };

  return {
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
  };
}
