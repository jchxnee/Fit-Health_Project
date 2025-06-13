import { ThemeProvider } from 'styled-components';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage.jsx';
import RecommendedExerciseSection from './pages/RecommendExercise.jsx';
import CoachDetail from './pages/CoachMatching/CoachDetail';
import RecommendExercise from './pages/RecommendExercise.jsx';
import CoachRegister from './pages/coach/CoachRegister';
import RegionSelect from './components/RegionSelect.jsx';
import CoachCalendar from './components/CoachDetails/CoachCalendar.jsx';
import NextReservation from './pages/MatchingList/NextReservation.jsx';
import HistoryModal from './components/modal/HistoryModal.jsx';
import CoachList from './pages/CoachMatching/CoachList';
import MatchingList from './pages/MatchingList/MatchingList';
import ProductList from './pages/Products/ProductList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ProductList />
      <Router>
        <Routes>
          {/* 기본 */}
          <Route path="/" element={<MainPage />} /> {/* 메인페이지 */}
          <Route path="/signup" element={<SignUpPage />} /> {/* 회원가입 */}
          <Route path="/login" element={<LoginPage />} /> {/* 로그인 */}
          <Route path="/mypage" element={<></>} /> {/* 마이페이지 */}
          <Route path="/exercise" element={<RecommendExercise />} /> {/* 추천 운동 */}
          {/* 코치 */}
          <Route path="/coachList" element={<CoachList />} /> {/* 핏코치 매칭 */}
          <Route path="/coachRegister" element={<CoachRegister />} /> {/* 코치 등록 */}
          <Route path="/coach/:id" element={<CoachDetail />} /> {/* 코치 등록 */}
          <Route path="/coachMatching" element={<CoachMatching />} /> {/* 핏코치 매칭 신청 */}
          <Route path="/coachReview" element={<CoachReview />} /> {/* 코치 리뷰 */}
          <Route path="/paymentPage" element={<PaymentPage />} /> {/* 결제페이지 */}
          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityPage />} /> {/* 커뮤니티 */}
          <Route path="/notice" element={<NoticePage />} /> {/* 공지사항 */}
          {/* 고객 */}
          <Route path="/matchingList" element={<MatchingList />} /> {/* 신청 내역 */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
