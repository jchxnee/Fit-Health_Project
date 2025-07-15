import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import axios from 'axios';

// 소셜 로그인 등으로 쿠키에 저장된 토큰을 sessionStorage에 저장하는 함수
function setTokenFromCookie() {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  if (match) {
    sessionStorage.setItem('token', match[1]);
    axios.defaults.headers.common['Authorization'] = `Bearer ${match[1]}`;
  }
}
setTokenFromCookie();

createRoot(document.getElementById('root')).render(<App />);
