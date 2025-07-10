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

  //아이디(이메일) 찾기
  findId: async (name, phone) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MEMBER.FINDID, {
        params: { name, phone },
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

  getMemberBirth: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MEMBER.BIRTH);
      return data;
    } catch (error) {
      console.error('회원 프로필 조회 실패:', error);
      throw new Error('회원 정보를 불러오지 못했습니다.');
    }
  },

  //프로필 이미지 수정
  updateProfileImage: async (changeName) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATEPROFILEIMAGE, { changeName });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '프로필 사진 수정하는데 실패하였습니다.';
        throw new Error(message);
      }
      throw new Error('서버 통신 불량');
    }
  },

  //이름 수정
  updateName: async (userName) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATENAME, { userName });

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
  updateBirth: async (newBirth) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATEBIRTH, {
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

  getMemberInfo: async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.MEMBER.INFO);
      return data;
    } catch (error) {
      console.error('회원 프로필 조회 실패:', error);
      throw new Error('회원 정보를 불러오지 못했습니다.');
    }
  },

  //내 정보 수정
  updateInfo: async (data) => {
    try {
      const { result } = await api.put(API_ENDPOINTS.MEMBER.BASE, {
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
  changePwd: async (userPwd) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.UPDATEPWD, { userPwd });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '비밀번호를 변경하는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //회원 탈퇴
  deleteMember: async () => {
    try {
      const { data } = await api.put(API_ENDPOINTS.MEMBER.DELETE);

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '회원 탈퇴하는데 실패하였습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
