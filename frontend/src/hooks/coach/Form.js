import { useState } from 'react';
import axios from 'axios';
import useUserStore from '../../store/useUserStore';
import { getUploadUrl, uploadFileToS3 } from '../../api/file';

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
      const imagePaths = [];

      // 1. 이미지 업로드 (0~5개까지 가능)
      for (const photo of photos) {
        if (photo?.file) {
          const { presignedUrl, changeName } = await getUploadUrl(photo.file.name, photo.file.type, 'trainer/');
          await uploadFileToS3(presignedUrl, photo.file);
          imagePaths.push(changeName); // 업로드 성공한 이미지 경로만 저장
        }
      }

      // 2. FormData 구성
      const formData = new FormData();
      formData.append('userEmail', userEmail);
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
      photos.forEach((photo, idx) => formData.append(`originName[${idx}]`, photo.file.name));

      // 이미지 경로를 서버로 전송
      imagePaths.forEach((path, idx) => {
        formData.append(`changeName[${idx}]`, path);
      });

      // 3. 서버로 전송
      const data = await axios.post('http://localhost:7961/api/trainer/register', formData, {
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
