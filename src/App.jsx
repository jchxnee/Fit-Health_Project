import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import BasicFilter from './components/filter/BasicFilter';
import CommunityPage from './pages/CommunityPage';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage.jsx';
import RecommendedExerciseSection from './pages/RecommendExercise.jsx';
import CoachDetail from './pages/CoachMatching/CoachDetail';
import CoachMatching from './pages/CoachMatching/CoachMatching';
import CommunityPostCreationPage from './pages/CommunityPostCreationPage';
import CommunityPostDetailPage from './pages/CommunityPostDetailPage';
import ReviewCreationPage from './pages/ReviewCreationPage';
import CoachReview from './pages/CoachReview';
import NextReservation from './pages/MatchingList/NextReservation';
import SelectExercise from './components/MainPage/SelectExercise';
import SelectGoal from './components/MainPage/SelectGoal';
import MemberInfoPage from './pages/MemberInfoPage';
import CustomInfoPage from './pages/CustomInfoPage';
import MatchingList from './pages/MatchingList/MatchingList';
import MyReviewsPage from './pages/MyReviewsPage';
import NoticePage from './pages/noticePage/NoticePage';
import NoticeDetailPage from './pages/noticePage/NoticeDetailPage';
import FAQPage from './pages/FAQPage/FAQPage';
import MyPostsPage from './pages/myselfWrite/MyPostsPage';
import MyCommentsPage from './pages/myselfWrite/MyCommentsPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        draggable
        hideProgressBar={false}
        newestOnTop
        theme="light"
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;
