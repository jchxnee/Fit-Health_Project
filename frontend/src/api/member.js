import api from './axios';
import { API_ENDPOINTS } from './config';

export const memberService = {
  //회원가입
  signUp: async (memberData) => {
    try {
      console.log('post 보내는 중 ', memberData);
      const { data } = await api.post(API_ENDPOINTS.MEMBER.BASE, {
        user_email: memberData.useremail,
        user_pwd: memberData.userpwd,
        user_name: memberData.username,
        phone: memberData.phone,
        birth: memberData.birth,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '회원가입에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통실 불량');
    }
  },
  login: async (email, password) => {
    try {
      const { data } = await api.postForm(API_ENDPOINTS.MEMBER.LOGIN, {
        user_email: email,
        user_pwd: password,
      });
      return data[0];
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '로그인에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통실 불량');
    }
  },
};
