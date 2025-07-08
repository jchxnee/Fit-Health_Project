import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      //로그인
      login: (userData) => {
        set({
          user: {
            email: userData.useremail,
            trainerNo: userData.trainerNo,
            name: userData.username,
            img: userData.profileimage,
            grade: userData.grade,
            socialType: userData.socialType,
          },
          isAuthenticated: true,
        });
      },

      //로그아웃
      logout: () => {
        sessionStorage.removeItem('token'); // 토큰 삭제
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // 유저 정보 업데이트
      updateUser: (updatedFields) => {
        set((state) => ({
          user: {
            ...state.user,
            ...updatedFields,
          },
        }));
      },
    }),
    {
      name: 'user-storage',
      //기본값 storage: localStorage -> 쿠키나 세션으로 변경 가능
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
