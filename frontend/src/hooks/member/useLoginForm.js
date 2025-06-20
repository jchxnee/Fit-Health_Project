import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { memberService } from '../../api/member';
import useUserStore from '../../store/useUserStore';

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
      setIsLoading(true); // 로딩 시작

      // 로그인 API 호출
      const user = await memberService.login(data);

      // 로그인 실패 시 알림 표시
      if (!user) {
        toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
        return;
      }

      // 로그인 성공 시 사용자 정보 상태 저장
      login({
        useremail: user.user_email,
        username: user.user_name,
        birth: user.birth,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        height: user.height,
        goal: user.goal,
        profileimage: user.profile_image,
        grade: user.grade,
      });

      toast.success('로그인 성공!');
      navigate('/'); // 홈으로 이동
    } catch (error) {
      // 네트워크 또는 기타 오류 처리
      toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
      console.error('로그인 에러 : ', error);
    } finally {
      setIsLoading(false); // 로딩 종료
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
