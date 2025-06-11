import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Routine from './components/RecommendRoutine';
import Header from './components/Header';
import CoachList from './pages/MatchingPage/CoachList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TitleBar title="추천 운동" />
    </ThemeProvider>
  );
}

export default App;
