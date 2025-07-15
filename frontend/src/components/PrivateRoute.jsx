import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
  const { user } = useUserStore();
  const location = useLocation();
  const hasShownToast = useRef(false); // 여러 번 뜨는 것 방지

  useEffect(() => {
    if (!user && !hasShownToast.current) {
      toast.warning('로그인 후 이용 가능한 서비스입니다.');
      hasShownToast.current = true;
    }
  }, [user]);

  // 로그인 상태 아니면 /login 으로 보내되, 현재 위치 기억
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
