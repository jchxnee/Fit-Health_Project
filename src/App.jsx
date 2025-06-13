import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import Footer from './components/Footer';
import BasicFilter from './components/filter/BasicFilter';
import CommunityPage from './pages/CommunityPage';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage.jsx';
import RecommendedExerciseSection from './pages/RecommendExercise.jsx';
import CoachDetail from './pages/MatchingPage/CoachDetail';
import RecommendExercise from "./pages/RecommendExercise.jsx";
import CoachRegister from "./pages/CoachRegister.jsx";
import RegionSelect from "./components/RegionSelect.jsx";
import CoachCalendar from "./components/CoachDetails/CoachCalendar.jsx";
import NextReservation from "./pages/MatchingList/NextReservation.jsx";
import HistoryModal from "./components/modal/HistoryModal.jsx";
import MatchingList from "./pages/MatchingList/MatchingList.jsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CoachCalendar />
    </ThemeProvider>
  );
}

export default App;
