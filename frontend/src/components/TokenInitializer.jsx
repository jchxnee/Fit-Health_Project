import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { memberService } from '../api/member';
import { toast } from 'react-toastify';

const TokenInitializer = () => {
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const cookieToken = Cookies.get('token');
      const action = sessionStorage.getItem('action'); // 'delete' 여부 확인

      if (cookieToken) {
        sessionStorage.setItem('token', cookieToken);
        Cookies.remove('token');
      }

      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const memberInfo = await memberService.getMemberInfo();

        // 탈퇴
        if (action === 'delete') {
          const confirmed = window.confirm(`소셜 로그인 계정은 탈퇴 후 복구가 불가능합니다.\n정말 탈퇴하시겠습니까?`);

          sessionStorage.removeItem('action');

          if (!confirmed) {
            toast.info('탈퇴가 취소되었습니다.');
            navigate('/');
            return;
          }

          try {
            await memberService.deleteMember(); // 백엔드 탈퇴 요청
            logout();
            toast.success('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
          } catch (deleteError) {
            console.error('탈퇴 실패:', deleteError);
            toast.error('회원 탈퇴에 실패했습니다.');
            logout();
            navigate('/');
          }

          return; // 탈퇴 후 더 이상 진행하지 않음
        }

        // 로그인 상태 저장
        sessionStorage.setItem('userEmail', memberInfo.user_email); // userEmail 세션 저장 추가
        login({
          useremail: memberInfo.user_email,
          trainerNo: memberInfo.trainer_no,
          username: memberInfo.user_name,
          birth: memberInfo.birth,
          phone: memberInfo.phone,
          address: memberInfo.address,
          gender: memberInfo.gender,
          height: memberInfo.height,
          goal: memberInfo.goal,
          profileimage: memberInfo.profile_image,
          grade: memberInfo.grade,
          socialType: memberInfo.social_type,
        });
        console.log('로그인에 성공!');
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
        sessionStorage.removeItem('token');
        logout();
        navigate('/login');
      }
    };

    init();
  }, []);

  return null;
};

export default TokenInitializer;
