import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { memberService } from '../../api/member';

// 회원가입 폼의 유효성 검사 스키마
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
    .matches(/^\d{11}$/, '전화번호는 11자리 숫자로만 입력해주세요.') // Ensures exactly 11 digits and only numbers
    .required('전화번호를 입력해주세요.'),

  birth: yup.date().max(new Date(), '미래 날짜는 선택할 수 없습니다.'),
});

export const useSignUpForm = () => {
  const navigate = useNavigate();
  //react-hook-form으로 폼 상태 초기화 및 유효성 검사
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, //유효성 에러 및 제출중 상태
    setError,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(signUpSchema), //yup스키마와 연결
    mode: 'onChange',
  });

  const onsubmit = async (data) => {
    try {
      //중복 이메일 체크
      //setError('email', {});

      //회원가입 API 호출
      console.log('memberService 보내는 중 ', data);
      await memberService.signUp({
        useremail: data.useremail,
        userpwd: data.userpwd,
        username: data.username,
        phone: data.phone,
        birth: data.birth,
      });

      toast.success('회원가입 완료!');
      navigate('/login');
    } catch (error) {
      toast.error('회원가입 중 문제가 발생하였습니다.');
      console.error('회원가입 에러 : ', error);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    onsubmit,
    errors,
    isSubmitting,
    watch,
    trigger,
    setError,
  };
};
