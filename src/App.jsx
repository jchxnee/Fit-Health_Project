import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AccountSettingsPage from './pages/AccountSettingPage';
import Footer from './components/Footer';
import MemberInfoPage from './pages/MemberInfoPage';
import CustomInfoPage from './pages/CustomInfoPage';
import DeleteMemberPage from './pages/DeleteMemberPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <MemberInfoPage />
      <CustomInfoPage />
      <DeleteMemberPage />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
