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
            name: userData.username,
            birth: userData.birth,
            phone: userData.phone,
            address: userData.address,
            gender: userData.gender,
            height: userData.height,
            goal: userData.goal,
            img: userData.profileimage,
            grade: userData.grade,
          },
          isAuthenticated: true,
        });
      },

      //로그아웃
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
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
