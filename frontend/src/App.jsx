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
import DeleteMemberPage from './pages/myPage/DeleteMemberPage';
import MyCommentsPage from './pages/myselfWrite/MyCommentsPage';
import CommunityPostDetailPage from './pages/community/CommunityPostDetailPage';
import ReviewCreationPage from './pages/community/ReviewCreationPage';
import OperatingPolicyPage from './pages/InformationPage/OperatingPolicyPage';
import TermOfServicePage from './pages/InformationPage/TermOfServicePage';
import PrivacyPolicyPage from './pages/InformationPage/PrivacyPolicyPage';
import CompanyIntroducionPage from './pages/InformationPage/CompanyIntroducionPage';
import FAQPage from './pages/FAQPage/FAQPage';
import MyInfoPage from './pages/myPage/MyInfoPage';
import ChangePwdPage from './pages/myPage/ChangePwdPage';
import RecruitmentInfoPage from './pages/InformationPage/RecruitmentInfoPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <Router>
        <Header user={null} /> {/* 알림 2차 */}
        <Routes>
          {/* 공통 */}
          <Route path="/" element={<MainPage />} /> {/* 메인페이지 */}
          <Route path="/signup" element={<SignUpPage />} /> {/* 회원가입 */}
          <Route path="/login" element={<LoginPage />} /> {/* 로그인 */}
          <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 */}
          <Route path="/accountSettingPage" element={<AccountSettingsPage />} /> {/* 계정설정 */}
          <Route path="/myInfoPage" element={<MyInfoPage />} /> {/* 내 정보 관리 */}
          <Route path="/changePwdPage" element={<ChangePwdPage />} /> {/* 비밀번호 변경 */}
          <Route path="/deleteMemberPage" element={<DeleteMemberPage />} /> {/* 회원탈퇴 */}
          <Route path="/exercise" element={<RecommendExercise />} /> {/* 추천 운동 */} {/* 2차 */}
          <Route path="/productList" element={<ProductList />} /> {/* 건강 상품 리스트 */}
          <Route path="/chat" element={<ChatPage />} /> {/* 채팅 */}
          <Route path="/termOfServicePage" element={<TermOfServicePage />} /> {/* 이용약관 */}
          <Route path="/operatingPolicy" element={<OperatingPolicyPage />} /> {/* 운영정책 */}
          <Route path="/privacyPolicy" element={<PrivacyPolicyPage />} /> {/* 개인정보처리방침 */}
          <Route path="/introduce" element={<CompanyIntroducionPage />} /> {/* 회사소개 */}
          <Route path="/recruitmentInfo" element={<RecruitmentInfoPage />} /> {/* 채용공고 */}
          {/* 코치 */}
          <Route path="/coachList" element={<CoachList />} /> {/* 핏코치 매칭 */}
          <Route path="/coachRegister" element={<CoachRegister />} /> {/* 코치 등록 */}
          <Route path="/coach/:id" element={<CoachDetail />} /> {/* 핏코치 매칭 상세페이지 */}
          <Route path="/coachMatching" element={<CoachMatching />} /> {/* 핏코치 매칭 신청 */}
          <Route path="/nextReservation" element={<NextReservation />} /> {/* 다음 회차 예약 */}
          <Route path="/coachReview" element={<CoachReview />} /> {/* 코치 리뷰 */}
          <Route path="/paymentPage" element={<PaymentPage />} /> {/* 결제페이지 */}
          <Route path="/coachmatchingList" element={<CoachCalendar />} /> {/* 매칭내역 */}
          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityPage />} /> {/* 커뮤니티 */}
          <Route path="/communityPostCreationPage" element={<CommunityPostCreationPage />} /> {/* 커뮤니티 글등록 */}
          <Route path="/reviewCreationPage" element={<ReviewCreationPage />} /> {/* 리뷰 등록 */}
          <Route path="/communityDetailPage/:id" element={<CommunityPostDetailPage />} /> {/* 커뮤니티 상세페이지 */}
          <Route path="/notice" element={<NoticePage />} /> {/* 공지사항 */}
          <Route path="/faqPage" element={<FAQPage />} /> {/* 자주 묻는 질문 */}
          <Route path="/myPostsPage" element={<MyPostsPage />} /> {/* 내가 쓴 게시물 */}
          <Route path="/myCommentsPage" element={<MyCommentsPage />} /> {/* 내가 쓴 댓글 */}
          <Route path="/myReviewsPage" element={<MyReviewsPage />} /> {/* 내가 쓴 리뷰 */}
          {/* 고객 */}
          <Route path="/matchingList" element={<MatchingList />} /> {/* 신청 내역 */}
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
