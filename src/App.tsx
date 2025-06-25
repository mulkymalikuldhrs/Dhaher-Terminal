import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import './index.css';
import { NotificationProvider } from './components/notifications/NotificationService';

export function App() {
  useEffect(() => {
    // Load Google Fonts - Inter for UI and Fira Mono for terminal-style text
    const linkInter = document.createElement('link');
    linkInter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    linkInter.rel = 'stylesheet';
    document.head.appendChild(linkInter);
    
    const linkMono = document.createElement('link');
    linkMono.href = 'https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap';
    linkMono.rel = 'stylesheet';
    document.head.appendChild(linkMono);
    
    // Set document title
    document.title = 'Dhaher Terminal | Professional Trading Platform';
    
    // Apply Bloomberg-style background to body
    document.body.style.backgroundColor = '#0c121c'; // Bloomberg-style dark navy
    
    return () => {
      document.head.removeChild(linkInter);
      document.head.removeChild(linkMono);
    };
  }, []);

  return (
    <NotificationProvider>
      <Dashboard />
    </NotificationProvider>
  );
}

export default App;
