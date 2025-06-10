import { ThemeProvider } from 'styled-components'
import './App.css'
import Footer from './components/Footer'
import theme from './styles/theme'
import createGlobalStyle from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* 1920px 푸터가 들어갈 공간을 확보하기 위해 body에 overflow-x: auto를 줄 수도 있지만,
       일반적으로는 특정 컴포넌트만 스크롤되도록 하는 것이 더 나은 사용자 경험을 제공합니다.
       여기서는 footer 자체에서 margin: 0 auto; 로 중앙 정렬만 합니다. */
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: Arial, sans-serif;
  }

  main {
    flex-grow: 1;
    /* max-width 등을 설정하여 main 콘텐츠도 화면 중앙에 오도록 조정하는 것이 좋습니다. */
  }
`;

function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
    <Footer/>
    </ThemeProvider>
  )
}

export default App
