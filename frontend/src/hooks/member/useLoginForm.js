import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import useUserStore from '../../store/useUserStore';
import { userService } from '../../api/user';

const loginSchema = yup.object().shape({
  email: yup.string().email('유효한 이메일 주소를 입력...').required('이메일을 입력...'),

  password: yup.string().min(8, '비밀번호는 8자 이상...').required('비밀번호를 입력...'),
});

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onsubmit = async (data) => {
    try {
      setIsLoading(true);
      const user = await userService.login(data.email, data.password);

      if (!user) {
        throw new Error('이메일 또는 비밀번호 불일치');
      }

      login({
        email: user.email,
        username: user.username,
        role: user.role,
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

  return {
    register,
    handleSubmit,
    errors,
    onsubmit,
    isLoading,
  };
};
