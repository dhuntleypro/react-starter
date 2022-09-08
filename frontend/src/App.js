import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalStyle from './globalStyles';

// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter basename="">
        <GlobalStyle />
        <h1>nav</h1>
        {/* <SplashPage /> */}

        <main>
          <Routes>
            <Route path="/" element={<>Home</>} />
            <Route path="/sign-up" element={<>Sign Up</>} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
