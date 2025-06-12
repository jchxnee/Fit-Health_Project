import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import BasicFilter from './components/filter/BasicFilter';
import CommunityPage from './pages/CommunityPage';
import GlobalStyle from './styles/GlobalStyle';
import ReviewCreationPage from './pages/ReviewCreationPage';
import CoachReview from './pages/CoachReview';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ReviewCreationPage />
    </ThemeProvider>
  );
}

export default App;
