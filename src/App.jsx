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
import CoachDetail from './pages/MatchingPage/CoachDetail';
import CoachMatching from './pages/MatchingPage/CoachMatching';
import CommunityPostCreationPage from './pages/CommunityPostCreationPage';
import CommunityPostDetailPage from './pages/CommunityPostDetailPage';
import ReviewCreationPage from './pages/ReviewCreationPage';
import CoachReview from './pages/CoachReview';
import MyReviewsPage from './pages/MyReviewsPage';
import NoticePage from './pages/noticePage/NoticePage';
import NoticeDetailPage from './pages/noticePage/NoticeDetailPage';
import FAQPage from './pages/FAQPage/FAQPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <FAQPage />
    </ThemeProvider>
  );
}

export default App;
