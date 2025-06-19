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
  login: async (memberData) => {
    try {
      console.log('post 보내는 중 ', memberData);
      const { data } = await api.post(API_ENDPOINTS.MEMBER.LOGIN, {
        user_email: memberData.useremail,
        user_pwd: memberData.userpwd,
      });
      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '로그인에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통실 불량');
    }
  },
  checkEmailExists: async (email) => {
    try {
      console.log('GET 보내는 중 ', email);

      const { data } = await api.get(API_ENDPOINTS.MEMBER.FIND, {
        params: {
          userEmail: email,
        },
      });

      // 이메일이 존재하면 true 반환
      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '이메일을 가져오는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
