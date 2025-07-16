import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { ToastContainer } from 'react-toastify';

// Header/Footer
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지 컴포넌트
import MainPage from './pages/MainPage.jsx';
import RecommendExercise from './pages/RecommendExercise.jsx';
import CoachDetail from './pages/coach/CoachDetail';
import CoachRegister from './pages/coach/CoachRegister';
import CoachCalendar from './components/CoachDetails/CoachCalendar.jsx';
import NextReservation from './pages/MatchingList/NextReservation.jsx';
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
import useUserStore from './store/useUserStore';
import RefundPage from './pages/PayPage/RefundPage';
import NoticePostCreationPage from './pages/noticePage/NoticePostCreationPage';
import NoticeDetailPage from './pages/noticePage/NoticeDetailPage';
import CoachModify from './pages/coach/CoachModify.jsx';
import ScrollToTop from './components/ScrollToTop';
import KakaoRedirect from './pages/KakaoRedirect';
import TokenInitializer from './components/TokenInitializer';
import FindIdPage from './pages/MemberPage/FindIdPage';
import FindPwdPage from './pages/MemberPage/FindPwdPage';
import ResetPwdPage from './pages/MemberPage/ResetPwdPage';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import ChatBot from './components/ChatBot';

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/signup'];
  const isHeaderHidden = hideHeader.includes(location.pathname);
  const { user } = useUserStore();

  return (
    <>
      <TokenInitializer />
      {!isHeaderHidden && <Header />}
      <ScrollToTop />
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/findId" element={<FindIdPage />} />
        <Route path="/findPwd" element={<FindPwdPage />} />
        <Route path="/ResetPwdPage" element={<ResetPwdPage />} />
        <Route path="/coachList" element={<CoachList />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/chatpage/:roomId" element={<ChatPage />} />
        <Route path="/termOfServicePage" element={<TermOfServicePage />} />
        <Route path="/operatingPolicy" element={<OperatingPolicyPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="/introduce" element={<CompanyIntroducionPage />} />
        <Route path="/recruitmentInfo" element={<RecruitmentInfoPage />} />
        <Route path="/faqPage" element={<FAQPage />} />
        <Route path="/oauth/kakao/redirect" element={<KakaoRedirect />} />
        <Route path="*" element={<NotFound />} />

        {/* 인증 필요 라우트 */}
        <Route element={<PrivateRoute />}>
          {/* 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/accountSettingPage" element={<AccountSettingsPage />} />
          <Route path="/myInfoPage" element={<MyInfoPage />} />
          <Route path="/changePwdPage" element={<ChangePwdPage />} />
          <Route path="/deleteMemberPage" element={<DeleteMemberPage />} />

          {/* 코치 관련 */}
          <Route path="/coachRegister" element={<CoachRegister />} />
          <Route path="/coach/:id" element={<CoachDetail />} />
          <Route path="/coachModify/:trainerNo" element={<CoachModify />} />
          <Route path="/coachMatching/:id" element={<CoachMatching />} />
          <Route path="/nextReservation" element={<NextReservation />} />
          <Route path="/coachReview/:trainerNo" element={<CoachReview />} />
          <Route path="/paymentPage/:id" element={<PaymentPage />} />
          <Route path="/refundPage/:id" element={<RefundPage />} />
          <Route path="/coachmatchingList" element={<CoachCalendar />} />

          {/* 커뮤니티 */}
          <Route path="/communityPostCreationPage" element={<CommunityPostCreationPage />} />
          <Route path="/community/:id/edit" element={<CommunityPostCreationPage isEditMode={true} />} />
          <Route path="/reviewCreationPage" element={<ReviewCreationPage />} />
          <Route path="/communityDetailPage/:id" element={<CommunityPostDetailPage />} />
          <Route path="/notice/:id/edit" element={<NoticePostCreationPage isEditMode={true} />} />
          <Route path="/NoticePostCreationPage" element={<NoticePostCreationPage />} />
          <Route path="/NoticeDetailPage/:noticeNo" element={<NoticeDetailPage />} />

          <Route path="/myPostsPage" element={<MyPostsPage />} />
          <Route path="/myCommentsPage" element={<MyCommentsPage />} />
          <Route path="/myReviewsPage" element={<MyReviewsPage />} />

          {/* 기타 */}
          <Route path="/exercise" element={<RecommendExercise />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/matchingList" element={<MatchingList />} />
        </Route>
      </Routes>
      {!isHeaderHidden && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContent />
        <ChatBot />
      </Router>
      <ToastContainer autoClose={3000} hideProgressBar={true} pauseOnFocusLoss={false} pauseOnHover={false} />
    </ThemeProvider>
  );
}

export default App;
