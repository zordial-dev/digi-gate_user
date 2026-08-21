import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import ScannerLandingPage from './pages/ScannerLandingPage';
import VisitorFormPage from './pages/VisitorFormPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScannerLandingPage />} />
          <Route path="/visitor/form/:orgId" element={<VisitorFormPage />} />
          <Route path="/org/:orgId" element={<VisitorFormPage />} />
          <Route path="/form/:orgId" element={<VisitorFormPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;