import { ThemeProvider } from 'styled-components';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage.jsx';
import RecommendedExerciseSection from './pages/RecommendExercise.jsx';
import CoachDetail from './pages/coach/CoachDetail';
import RecommendExercise from './pages/RecommendExercise.jsx';
import CoachRegister from './pages/coach/CoachRegister';
import RegionSelect from './components/RegionSelect.jsx';
import CoachCalendar from './components/CoachDetails/CoachCalendar.jsx';
import NextReservation from './pages/MatchingList/NextReservation.jsx';
import HistoryModal from './components/modal/HistoryModal.jsx';
import CoachList from './pages/coach/CoachList';
import MatchingList from './pages/MatchingList/MatchingList';
import ProductList from './pages/Products/ProductList';
import SignUpPage from './pages/MemberPage/SignUpPage';
import LoginPage from './pages/MemberPage/LoginPage';
import CoachMatching from './pages/coach/CoachMatching';
import CoachReview from './pages/community/CoachReview';
import PaymentPage from './pages/PayPage/PaymentPage';
import MyPage from './pages/MemberPage/MyPage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/community/CommunityPage';
import NoticePage from './pages/noticePage/NoticePage';
import CommunityPostCreationPage from './pages/community/CommunityPostCreationPage';
import AccountSettingsPage from './pages/myPage/AccountSettingPage';
import MyPostsPage from './pages/myselfWrite/MyPostsPage';
import MyReviewsPage from './pages/myselfWrite/MyReviewsPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* 공통 */}
          <Route path="/" element={<MainPage />} /> {/* 메인페이지 */}
          <Route path="/signup" element={<SignUpPage />} /> {/* 회원가입 */}
          <Route path="/login" element={<LoginPage />} /> {/* 로그인 */}
          <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 */}
          <Route path="/exercise" element={<RecommendExercise />} /> {/* 추천 운동 */}
          <Route path="/productList" element={<ProductList />} /> {/* 건강 상품 리스트 */}
          <Route path="/chat" element={<ChatPage />} /> {/* 채팅 */}
          <Route path="/accountSettingPage" element={<AccountSettingsPage />} /> {/* 계정설정 */}
          {/* 코치 */}
          <Route path="/coachList" element={<CoachList />} /> {/* 핏코치 매칭 */}
          <Route path="/coachRegister" element={<CoachRegister />} /> {/* 코치 등록 */}
          <Route path="/coach/:id" element={<CoachDetail />} /> {/* 핏코치 매칭 상세페이지 */}
          <Route path="/coachMatching" element={<CoachMatching />} /> {/* 핏코치 매칭 신청 */}
          <Route path="/coachReview" element={<CoachReview />} /> {/* 코치 리뷰 */}
          <Route path="/paymentPage" element={<PaymentPage />} /> {/* 결제페이지 */}
          <Route path="/coachmatchingList" element={<CoachCalendar />} /> {/* 결제페이지 */}
          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityPage />} /> {/* 커뮤니티 */}
          <Route path="/communityPostCreationPage" element={<CommunityPostCreationPage />} /> {/* 커뮤니티 글등록 */}
          <Route path="/notice" element={<NoticePage />} /> {/* 공지사항 */}
          <Route path="/myPostPage" element={<MyPostsPage />} /> {/* 내가 쓴 게시물 */}
          <Route path="/myCommentsPage" element={<myCommentsPage />} /> {/* 내가 쓴 댓글 */}
          <Route path="/myReviewPage" element={<MyReviewsPage />} /> {/* 내가 쓴 리뷰 */}
          {/* 고객 */}
          <Route path="/matchingList" element={<MatchingList />} /> {/* 신청 내역 */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
