import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 경로가 변경될 때마다 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
  }, [pathname]); // pathname이 변경될 때마다 이 효과를 재실행

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}

export default ScrollToTop;
