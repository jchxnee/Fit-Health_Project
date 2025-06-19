import api from './axios';
import { API_ENDPOINTS } from './config';

export const healthService = {
  //건강 정보 저장
  saveHealth: async (healthData) => {
    try {
      console.log('post 보내는 중 ', healthData);
      const { data } = await api.post(API_ENDPOINTS.HEALTH.BASE, {
        user_email: healthData.useremail,
        weight: healthData.weight,
        body_fat: healthData.bodyFat,
        skeletal_muscle: healthData.skeletalMuscle,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '건강 정보 저장에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  //건강 정보 조회
  getHealthData: async (useremail) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.HEALTH.BASE, {
        params: {
          userEmail: useremail,
        },
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || '건강 정보 조회에 실패했습니다.';
      throw new Error(message);
    }
  },
};
