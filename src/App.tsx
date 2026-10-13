import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Home from './pages/Home';
import WhyDigiGatePage from './pages/WhyDigiGatePage';
import BenefitsPage from './pages/BenefitsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import SolutionsPage from './pages/SolutionsPage';
import SecurityPage from './pages/SecurityPage';
import FaqPage from './pages/FaqPage';
import ScannerLandingPage from './pages/ScannerLandingPage';
import VisitorFormPage from './pages/VisitorFormPage';
import RegisterBusinessPage from './pages/RegisterBusinessPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why-digi-gate" element={<WhyDigiGatePage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/faq" element={<FaqPage />} />
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