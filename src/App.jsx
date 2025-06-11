import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Routine from './components/RecommendRoutine';
import Header from './components/Header';
import CoachList from './pages/MatchingPage/CoachList';
import CategoryMenu from './components/CategoryMenu';
import Footer from './components/Footer';
import BasicFilter from './components/filter/BasicFilter';
import CommunityPage from './pages/CommunityPage';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CoachList />
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
