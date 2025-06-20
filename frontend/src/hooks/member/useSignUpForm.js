import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { memberService } from '../../api/member';
import { useState } from 'react';

// 회원가입 유효성 검사 스키마 정의
const signUpSchema = yup.object().shape({
  useremail: yup.string().email('유효한 이메일 주소를 입력해주세요.').required('이메일을 입력해주세요.'),

  userpwd: yup
    .string()
    .min(8, '비밀번호는 8자 이상 입력해주세요.')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+`~])[a-zA-Z\d!@#$%^&*()\-_=+`~]{8,24}$/,
      '비밀번호는 영문자, 숫자, 특수문자를 모두 포함해서 입력해주세요.'
    )
    .required('비밀번호를 입력해주세요.'),

  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('userpwd'), null], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인을 입력해주세요.'),

  username: yup
    .string()
    .min(2, '사용자 이름은 2자 이상 입력해주세요.')
    .max(20, '사용자 이름은 20자 이하 입력해주세요.')
    .required('사용자 이름을 입력해주세요.'),

  phone: yup
    .string()
    .matches(/^\d{11}$/, '전화번호는 11자리 숫자로만 입력해주세요.')
    .required('전화번호를 입력해주세요.'),

  birth: yup
    .date()
    .nullable() // null 허용
    .notRequired() // 필수 아님
    .max(new Date(), '미래 날짜는 선택할 수 없습니다.'),
});

// 회원가입 폼 커스텀 훅 정의
export const useSignUpForm = () => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form 설정
  const {
    register, // 입력 필드와 연결하는 메서드
    handleSubmit, // 제출 함수 래퍼
    formState: {
      errors, // 유효성 검사 에러 객체
      isSubmitting, // 제출 중 상태
    },
    setError, // 특정 필드에 수동으로 에러 설정
    watch, // 필드 값 실시간 감시
    trigger, // 특정 필드 강제 유효성 검사
  } = useForm({
    resolver: yupResolver(signUpSchema), // yup 스키마로 유효성 검사 연결
    mode: 'onChange', // 입력값 변경 시마다 검사 실행
  });

  // 실제 회원가입 처리 함수
  const onsubmit = async (data) => {
    try {
      setIsLoading(true); // 로딩 시작

      await memberService.signUp(data);

      // 성공 메시지 및 로그인 페이지로 이동
      toast.success('회원가입 완료!');
      navigate('/login');
    } catch (error) {
      // 에러 발생 시 알림
      toast.error('회원가입 중 문제가 발생하였습니다.');
      console.error('회원가입 에러 : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트에서 사용할 값들 반환
  return {
    register, // 인풋 필드 연결
    handleSubmit, // 폼 제출 핸들러
    onsubmit, // 커스텀 제출 로직
    errors, // 유효성 검사 에러
    isSubmitting, // 제출 상태 (버튼 비활성화 등)
    watch, // 실시간 값 감시
    trigger, // 수동 유효성 검사 실행
    setError, // 수동 에러 설정
    isLoading,
  };
};
