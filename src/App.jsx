import { ThemeProvider } from 'styled-components';
import './App.css';
import TitleBar from './components/TitleBar';
import theme from './styles/theme';
import BasicModal from './components/modal/BasicModal';
import NotificationList from './components/NotificationList';
import BasicFilter from './components/filter/BasicFilter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TitleBar title="추천 운동" />
    </ThemeProvider>
  );
}

export default App;
