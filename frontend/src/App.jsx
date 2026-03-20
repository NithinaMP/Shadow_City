import { useState } from 'react';
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import ScannerPage from './pages/ScannerPage';
import InterviewPage from './pages/InterviewPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [activePage, setActivePage] = useState('scanner');
  const [auditHistory, setAuditHistory] = useState([]);

  const addToHistory = (entry) => {
    setAuditHistory(prev => [entry, ...prev]);
  };

  const pages = {
    scanner: <ScannerPage addToHistory={addToHistory} />,
    interview: <InterviewPage />,
    dashboard: <DashboardPage localHistory={auditHistory} />,
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Header />
      <NavTabs activePage={activePage} setActivePage={setActivePage} />
      {pages[activePage]}
    </div>
  );
}