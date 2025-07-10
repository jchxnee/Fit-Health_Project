import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { memberService } from '../../api/member';
import useUserStore from '../../store/useUserStore';
import axios from 'axios';

// 로그인 유효성 검사 스키마 정의
const loginSchema = yup.object().shape({
  useremail: yup.string().email('유효한 이메일 주소를 입력해주세요.').required('이메일을 입력해주세요.'),
  userpwd: yup.string().required('비밀번호를 입력해주세요.'),
});

// 로그인 폼 커스텀 훅 정의
export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false); // 로그인 진행 상태
  const login = useUserStore((state) => state.login); // Zustand 상태 관리 훅
  const navigate = useNavigate(); // 페이지 이동 훅

  // react-hook-form 설정 (yup 스키마와 연동)
  const {
    register, // 각 인풋 필드와 연결
    handleSubmit, // 제출 함수 래퍼
    formState: { errors }, // 유효성 검사 에러 객체
  } = useForm({
    resolver: yupResolver(loginSchema), // yup을 사용한 유효성 검사 연결
    mode: 'onChange', // 입력값이 바뀔 때마다 검사 실행
  });

  // 실제 로그인 요청 처리 함수
  const onsubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await memberService.login(data);
      const token = response.token;

      if (!token) {
        toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
        return;
      }

      sessionStorage.setItem('token', token);
      // ⭐ 추가: Axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const memberInfo = await memberService.getMemberInfo(); // 이제 이 요청은 토큰을 포함하여 전송됩니다.

      login({
        useremail: memberInfo.user_email,
        trainerNo: memberInfo.trainer_no,
        username: memberInfo.user_name,
        birth: memberInfo.birth,
        phone: memberInfo.phone,
        address: memberInfo.address,
        gender: memberInfo.gender,
        height: memberInfo.height,
        goal: memberInfo.goal,
        profileimage: memberInfo.profile_image,
        grade: memberInfo.grade,
        socialType: memberInfo.social_type,
      });

      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다.');
      console.error('로그인 에러 : ', error);
      delete axios.defaults.headers.common['Authorization'];
      sessionStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };
  // 컴포넌트에서 사용할 값들 반환
  return {
    register, // 인풋 연결용
    handleSubmit, // 폼 제출용
    errors, // 유효성 에러 정보
    onsubmit, // 직접 실행될 로그인 함수
    isLoading, // 로딩 상태 (버튼 비활성화 등 활용 가능)
  };
};
