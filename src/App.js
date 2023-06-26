import './assets/scss/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/pencarian" element={<SearchPage />}></Route>
        <Route path="/tentang" element={<AboutPage />}></Route>
        <Route path="/auth" element={<AuthPage />}></Route>
        <Route path="/test-page" element={<TestPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
