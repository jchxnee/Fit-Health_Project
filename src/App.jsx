import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import BasicFilter from './components/filter/BasicFilter';
import CommunityPage from './pages/CommunityPage';
import GlobalStyle from './styles/GlobalStyle';
<<<<<<< HEAD
import MainPage from './pages/MainPage.jsx';
import RecommendedExerciseSection from './pages/RecommendExercise.jsx';
import CoachDetail from './pages/MatchingPage/CoachDetail';
import CoachMatching from './pages/MatchingPage/CoachMatching';
=======
import CommunityPostCreationPage from './pages/CommunityPostCreationPage';
import CommunityPostDetailPage from './pages/CommunityPostDetailPage';
>>>>>>> 028dd3831f7f3041891ceb3e416dafe6378abe5b

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
<<<<<<< HEAD
      {/* <CoachDetail /> */}
      {/* <CoachList /> */}
      <CoachMatching />
=======
      <CommunityPostDetailPage />
>>>>>>> 028dd3831f7f3041891ceb3e416dafe6378abe5b
    </ThemeProvider>
  );
}

export default App;
