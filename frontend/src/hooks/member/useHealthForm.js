import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { healthService } from '../../api/health';

const healthSchema = yup.object().shape({
  weight: yup
    .number()
    .typeError('몸무게는 숫자여야 합니다.')
    .required('몸무게를 입력해주세요.')
    .positive('0보다 커야 합니다.'),
  bodyFat: yup.number().typeError('체지방량은 숫자여야 합니다.').required('체지방량을 입력해주세요.').min(0),
  skeletalMuscle: yup.number().typeError('골격근량은 숫자여야 합니다.').required('골격근량을 입력해주세요.').min(0),
});

export const useHealthForm = ({ useremail, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(healthSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // 오늘 날짜 포맷 (예: 2025.06.19)
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
      ).padStart(2, '0')}`;

      // 기존 건강 데이터 조회
      const existingData = await healthService.getHealthData(useremail);

      // 오늘 등록된 데이터가 있는지 확인
      const alreadyExists = existingData.some((item) => {
        const itemDate = new Date(item.create_date);
        const itemDateString = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(
          itemDate.getDate()
        ).padStart(2, '0')}`;
        return itemDateString === todayString;
      });

      if (alreadyExists) {
        toast.error('오늘은 이미 건강 정보를 입력하셨습니다.');
        return;
      }

      const healthData = {
        ...data,
        useremail,
      };

      await healthService.saveHealth(healthData);

      toast.success('건강 정보가 저장되었습니다.');
      reset();

      onSuccess(healthData);
    } catch (err) {
      toast.error('건강 정보 저장 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    reset,
  };
};
