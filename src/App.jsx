import { ThemeProvider } from 'styled-components';
import './App.css';
import Footer from './components/Footer';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationList />
    </ThemeProvider>
  );
  );
}

export default App;
export default App;
