import './App.css';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import UserMenu from './components/modal/UserMenu';
import EditDeleteMenu from './components/modal/EditDeleteMenu';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <EditDeleteMenu />
    </ThemeProvider>
  );
}

export default App;
