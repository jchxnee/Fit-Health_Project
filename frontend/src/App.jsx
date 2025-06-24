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
import useUserStore from './store/useUserStore';
import RefundPage from './pages/PayPage/RefundPage';
import CoachModify from './pages/coach/CoachModify.jsx';
import NoticePostCreationPage from './pages/noticePage/NoticePostCreationPage';
import NoticeDetailPage from './pages/noticePage/NoticeDetailPage';

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/signup'];
  const isHeaderHidden = hideHeader.includes(location.pathname);
  const { user } = useUserStore();

  return (
    <>
      {!isHeaderHidden && <Header user={user} />}
      <Routes>
        {/* 공통 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/accountSettingPage" element={<AccountSettingsPage />} />
        <Route path="/myInfoPage" element={<MyInfoPage />} />
        <Route path="/changePwdPage" element={<ChangePwdPage />} />
        <Route path="/deleteMemberPage" element={<DeleteMemberPage />} />
        <Route path="/exercise" element={<RecommendExercise />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/termOfServicePage" element={<TermOfServicePage />} />
        <Route path="/operatingPolicy" element={<OperatingPolicyPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="/introduce" element={<CompanyIntroducionPage />} />
        <Route path="/recruitmentInfo" element={<RecruitmentInfoPage />} />

        {/* 코치 */}
        <Route path="/coachList" element={<CoachList />} />
        <Route path="/coachRegister" element={<CoachRegister />} />
        <Route path="/coach/:id" element={<CoachDetail />} />
        <Route path="/coachModify" element={<CoachModify />} />
        <Route path="/coachMatching" element={<CoachMatching />} />
        <Route path="/nextReservation" element={<NextReservation />} />
        <Route path="/coachReview" element={<CoachReview />} />
        <Route path="/paymentPage" element={<PaymentPage />} />
        <Route path="/refundPage/:id" element={<RefundPage />} />
        <Route path="/coachMatching/:id" element={<CoachMatching />} />
        <Route path="/coachModify/:trainerNo" element={<CoachModify />} />
        <Route path="/nextReservation" element={<NextReservation />} />
        <Route path="/coachReview" element={<CoachReview />} />
        <Route path="/paymentPage/:id" element={<PaymentPage />} />
        <Route path="/refundPage" element={<RefundPage />} />
        <Route path="/coachmatchingList" element={<CoachCalendar />} />

        {/* 커뮤니티 */}
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/communityPostCreationPage" element={<CommunityPostCreationPage user={user} />} />
        <Route path="/community/:id/edit" element={<CommunityPostCreationPage isEditMode={true} />} />
        <Route path="/reviewCreationPage" element={<ReviewCreationPage />} />
        <Route path="/communityDetailPage/:id" element={<CommunityPostDetailPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/:id/edit" element={<NoticePostCreationPage isEditMode={true} />} />
        <Route path="/NoticePostCreationPage" element={<NoticePostCreationPage />} />
        <Route path="/NoticeDetailPage/:noticeNo" element={<NoticeDetailPage />} />

        <Route path="/faqPage" element={<FAQPage />} />
        <Route path="/myPostsPage" element={<MyPostsPage />} />
        <Route path="/myCommentsPage" element={<MyCommentsPage />} />
        <Route path="/myReviewsPage" element={<MyReviewsPage />} />

        {/* 고객 */}
        <Route path="/matchingList" element={<MatchingList />} />
      </Routes>
      {!isHeaderHidden && <Footer user={null} />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
