import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import Login from './pages/Login';
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Login />
    </ThemeProvider>
  );
}

export default App;
