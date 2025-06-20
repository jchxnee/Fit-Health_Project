import api from './axios';
import { API_ENDPOINTS } from './config';

export const memberService = {
  //회원가입
  signUp: async (memberData) => {
    try {
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

      throw new Error('서버 통살 불량');
    }
  },

  //로그인
  login: async (memberData) => {
    try {
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

  //이메일 중복 확인
  checkEmailExists: async (email) => {
    try {
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

  //이름 수정
  updateName: async (useremail, newUsername) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATENAME, {
        user_email: useremail,
        user_name: newUsername,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '이름 수정하는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //생년월일 수정
  updateBirth: async (useremail, newBirth) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATEBIRTH, {
        user_email: useremail,
        birth: newBirth,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '생년월일 수정하는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //내 정보 수정
  updateInfo: async (useremail, data) => {
    try {
      const { result } = await api.put(API_ENDPOINTS.MEMBER.BASE, {
        user_email: useremail,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        height: data.height,
        goal: data.goal,
      });

      return result;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '내 정보 수정하는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //비밀번호 변경
  changePwd: async (useremail, userpwd) => {
    try {
      console.log(useremail);
      console.log(userpwd);
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATEPWD, {
        user_email: useremail,
        user_pwd: userpwd,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '비밀번호를 변경하는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
