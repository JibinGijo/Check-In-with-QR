import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AttendeeProvider } from './context/AttendeeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AttendeesPage from './pages/AttendeesPage';
import ImportPage from './pages/ImportPage';
import QRCodesPage from './pages/QRCodesPage';
import ScannerPage from './pages/ScannerPage';
import CheckInResultPage from './pages/CheckInResultPage';

function App() {
  return (
    <AttendeeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/attendees" element={<AttendeesPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/qr-codes" element={<QRCodesPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/scan/:id" element={<CheckInResultPage />} />
          </Routes>
        </Layout>
      </Router>
    </AttendeeProvider>
  );
}

export default App;