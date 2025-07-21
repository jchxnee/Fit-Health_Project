import React, { useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import useUserStore from '../store/useUserStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { memberService } from '../api/member';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.25rem;
`;

const KakaoRedirect = () => {
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    const action = sessionStorage.getItem('kakaoAction'); // 'login' or 'delete'

    if (code) {
      if (action === 'delete') {
        handleDeleteFlow(code);
      } else {
        handleLoginFlow(code);
      }
      sessionStorage.removeItem('kakaoAction');
    }
  }, []);

  const handleLoginFlow = async (code) => {
    try {
      const response = await axios.post('https://fit-health.store/api/members/kakao/login', { code });
      const token = response.data.token;

      sessionStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      login({
        useremail: decoded.sub,
        trainerNo: decoded.trainerNo,
        username: decoded.userName,
        profileimage: decoded.profileImage,
        grade: decoded.grade,
        socialType: decoded.socialType,
      });

      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error('Kakao 로그인 실패:', error.response?.data || error.message);
      toast.error('카카오 로그인에 실패했습니다.');
      navigate('/');
    }
  };

  const handleDeleteFlow = async (code) => {
    try {
      const response = await axios.post('https://fit-health.store/api/members/kakao/login', { code });

      if (response) {
        const confirmed = window.confirm('정말 탈퇴하시겠습니까?');
        if (confirmed) {
          try {
            await memberService.deleteMember(); // 회원 탈퇴 API
            logout();
            toast.success('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
            navigate('/');
          } catch (deleteError) {
            console.error('탈퇴 실패:', deleteError.response?.data || deleteError.message);
            toast.error('회원 탈퇴에 실패했습니다.');
          }
        } else {
          toast.info('탈퇴가 취소되었습니다.');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('카카오 인증 실패:', error.response?.data || error.message);
      toast.error('카카오 인증에 실패했습니다.');
      navigate('/');
    }
  };

  return (
    <Container>
      <LoadingContainer>
        <Spinner />
        <Title>카카오 인증 진행중...</Title>
      </LoadingContainer>
    </Container>
  );
};

export default KakaoRedirect;
