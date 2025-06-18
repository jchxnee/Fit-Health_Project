import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { memberService } from '../../api/member';
import useUserStore from '../../store/useUserStore';

const loginSchema = yup.object().shape({
  useremail: yup.string().email('유효한 이메일 주소를 입력해주세요.').required('이메일을 입력해주세요.'),

  userpwd: yup.string().required('비밀번호를 입력해주세요.'),
});

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  //react-hook-form으로 폼 상태 초기화 및 유효성 검사
  const {
    register,
    handleSubmit,
    formState: { errors }, //유효성 에러 및 제출중 상태
  } = useForm({
    resolver: yupResolver(loginSchema), //yup스키마와 연결
    mode: 'onChange',
  });

  const onsubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log('loginService 보내는 중', data);
      //로그인 API 호출
      const user = await memberService.login(data);

      if (!user) {
        toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
        return;
      }

      //로그인 성공시 store에 로그인 정보를 저장
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
      navigate('/');
    } catch (error) {
      toast.error('로그인 중 문제가 발생하였습니다.');
      console.error('로그인 에러 : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    errors,
    onsubmit,
    isLoading,
  };
};
