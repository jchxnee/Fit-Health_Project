import { ThemeProvider } from 'styled-components';
import './App.css';
import Footer from './components/Footer';
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
