import './App.css'
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Header from './components/Header'
import MainPage from "./components/MainPage.jsx";

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Header/>
      <MainPage/>
    </ThemeProvider>
  )
}

export default App
