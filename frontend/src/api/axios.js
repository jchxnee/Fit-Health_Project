// api/axios.js
import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// ✅ [1] 요청 시 Authorization 헤더에 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // 또는 localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Bearer 스킴 사용
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ [2] 응답 오류 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('접근권한이 없습니다.');
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          console.error('서버 에러 발생');
          break;
        default:
          console.error('API 에러 :', data);
      }
    } else if (error.request) {
      console.error('네트워크 에러 : ', error.request);
    } else {
      console.error('에러 :', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
