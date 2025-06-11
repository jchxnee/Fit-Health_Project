import { ThemeProvider } from 'styled-components';
import './App.css';
import theme from './styles/theme';
import MainPage from "./pages/MainPage.jsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainPage />
    </ThemeProvider>
  );
}

export default App;
