import { ThemeProvider } from 'styled-components';
import './App.css';
import Footer from './components/Footer';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Routine from './components/RecommendRoutine';
import Header from './components/Header';
import CoachList from './pages/MatchingPage/CoachList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <CoachList />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
