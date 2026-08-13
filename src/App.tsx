import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import VisitorFormPage from './pages/VisitorFormPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold">Digi-Gate</h1>
          </div>} />
          <Route path="/visitor/form/:orgId" element={<VisitorFormPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;