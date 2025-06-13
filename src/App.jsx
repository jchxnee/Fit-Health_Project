import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Header from './components/Header';
import LoginPage from './pages/MemberPage/LoginPage';
import SignUpPage from './pages/MemberPage/SignUpPage';
import AccountSettingsPage from './pages/MemberPage/AccountSettingPage';
import Footer from './components/Footer';
import MemberInfoPage from './pages/MemberPage/MemberInfoPage';
import CustomInfoPage from './pages/MemberPage/CustomInfoPage';
import DeleteMemberPage from './pages/MemberPage/DeleteMemberPage';
import PaymentPage from './pages/PayPage/PaymentPage';
import RefundPage from './pages/PayPage/RefundPage';
import ChatPage from './pages/ChatPage';
import CompanyIntroducionPage from './pages/InformationPage/CompanyIntroducionPage';
import TermOfServicePage from './pages/InformationPage/TermOfServicePage';
import OperatingPolicyPage from './pages/InformationPage/OperatingPolicyPage';
import PrivacyPolicyPage from './pages/InformationPage/PrivacyPolicyPage';
import RecruitmentInfoPage from './pages/InformationPage/RecruitmentInfoPage';
import MyPage from './pages/MemberPage/MyPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyPage />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
