import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Home from './pages/Home';
import ScannerLandingPage from './pages/ScannerLandingPage';
import VisitorFormPage from './pages/VisitorFormPage';
import RegisterBusinessPage from './pages/RegisterBusinessPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterBusinessPage />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/scan" element={<ScannerLandingPage />} />
          <Route path="/visitor/form/:orgId" element={<VisitorFormPage />} />
          <Route path="/org/:orgId" element={<VisitorFormPage />} />
          <Route path="/form/:orgId" element={<VisitorFormPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;