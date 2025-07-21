import { useState } from 'react';
import api from '../../api/axios';
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
    console.log('[submitForm] Starting form submission...');
    console.log('[submitForm] Current userEmail:', userEmail);
    console.log('[submitForm] Current photos state:', photos);
    console.log('[submitForm] Current careers state:', careers);

    try {
      const trainerPhotosData = []; // addTrainerDto.FileRequest[] 형식으로 보낼 데이터

      // 1. 이미지 업로드 (S3 Presigned URL 방식은 그대로 유지)
      console.log('[submitForm] Starting S3 image upload...');
      for (const photo of photos) {
        if (photo?.file) {
          console.log(`[submitForm] Uploading file: ${photo.file.name} (type: ${photo.file.type})`);
          try {
            const { presignedUrl, changeName } = await getUploadUrl(photo.file.name, photo.file.type, 'trainer/');
            console.log(
              `[submitForm] Received presignedUrl: ${presignedUrl ? 'Yes' : 'No'}, changeName: ${changeName}`
            );

            await uploadFileToS3(presignedUrl, photo.file);
            console.log(`[submitForm] Successfully uploaded ${photo.file.name} to S3.`);

            trainerPhotosData.push({
              originName: photo.file.name,
              changeName: changeName,
            });
          } catch (uploadErr) {
            console.error('S3 업로드 실패 : ', photo.file.name, uploadErr);
            // S3 업로드 실패 시 해당 파일은 건너뛰고 나머지 진행
          }
        }
      }
      console.log('[submitForm] S3 image upload completed. trainerPhotosData:', trainerPhotosData);

      // 2. JSON 데이터 객체 구성 (FormData 대신 일반 JavaScript 객체 사용)
      const requestBody = {
        userEmail: userEmail,
        majorName: majorName,
        wishArea: wishArea,
        kakaoId: kakaoId,
        instaId: instaId,
        oncePrice: price,
        discount3: discount3,
        discount5: discount5,
        discount10: discount10,
        introduce: intro,
        careers: careers,
        trainerPhoto: trainerPhotosData, // S3 업로드 후 구성된 FileRequest 객체 배열
      };
      console.log('[submitForm] Constructed requestBody (JSON):', JSON.stringify(requestBody, null, 2));

      // 3. 서버로 JSON 데이터 전송
      console.log('[submitForm] Sending POST request to /api/trainer/register...');
      const response = await api.post('https://fit-health.store/api/trainer/register', requestBody);

      setLoading(false);
      console.log('[submitForm] Successfully received response from server.');
      console.log('[submitForm] Server Response Data (trainerNo):', response.data);
      console.log('[submitForm] Server Response Status:', response.status);

      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error('Coach Register Form Submission Error:', err); // 디버깅을 위해 에러 로그 출력

      // Axios 에러인 경우 서버 응답 상세 정보를 출력
      if (api.isAxiosError(err) && err.response) {
        console.error('Server Response Data:', err.response.data);
        console.error('Server Response Status:', err.response.status);
        console.error('Server Response Headers:', err.response.headers);
      }
      return 0;
    } finally {
      console.log('[submitForm] Form submission process finished.');
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
