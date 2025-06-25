import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import PanelGrid from '../components/layout/PanelGrid';
import { defaultPanels } from '../data/mockData';
import { useMarketData } from '../hooks/useMarketData';
import { Panel, AssetCategory } from '../types';
import { Plus, Settings } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../components/notifications/NotificationService';

export default function Dashboard() {
  const [panels, setPanels] = useState<Panel[]>(defaultPanels);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const { addNotification } = useNotifications();
  const { assets, loading, error } = useMarketData(selectedCategory);
  
  // Simulate real-time market updates
  useEffect(() => {
    const marketUpdateInterval = setInterval(() => {
      // Simulate occasional market update
      if (Math.random() > 0.85 && assets.length > 0) {
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const changeType = Math.random() > 0.5 ? 'rise' : 'fall';
        const changePercent = (Math.random() * 0.5).toFixed(2);
        
        addNotification({
          type: 'price',
          title: `${asset.symbol} ${changeType === 'rise' ? 'Rising' : 'Falling'} Rapidly`,
          message: `${asset.symbol} has ${changeType === 'rise' ? 'increased' : 'decreased'} by ${changePercent}% in the last 5 minutes.`
        });
      }
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(marketUpdateInterval);
    };
  }, [addNotification, assets]);
  
  const handleRemovePanel = (id: string) => {
    setPanels(panels.filter(panel => panel.id !== id));
    toast.info('Panel removed');
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleCategorySelect = (category: AssetCategory | 'all') => {
    setSelectedCategory(category);
  };
  
  const addNewPanel = () => {
    // This would normally open a modal to select panel type
    // For simplicity, we'll just add a new chart panel
    const newPanel: Panel = {
      id: `chart-panel-${Date.now()}`,
      type: 'chart',
      title: 'New Chart',
      assetId: 'eurusd', // Default to EUR/USD
      x: 0,
      y: 0,
      w: 6,
      h: 6
    };
    
    setPanels([...panels, newPanel]);
    toast.success('New panel added');
  };
  
  const sendWhatsAppNotification = () => {
    // This would normally integrate with WhatsApp API
    // For demo purposes, we'll just show a toast
    toast.info('Signal sent to WhatsApp', {
      icon: '📱'
    });
  };

  const addNewEconomicCalendarPanel = () => {
    const newPanel: Panel = {
      id: `economic-calendar-${Date.now()}`,
      type: 'economic_calendar',
      title: 'Economic Calendar',
      x: 0,
      y: 0,
      w: 6,
      h: 6
    };
    
    setPanels([...panels, newPanel]);
    toast.success('Economic Calendar panel added');
  };

  const addNewCOTPanel = () => {
    const newPanel: Panel = {
      id: `cot-panel-${Date.now()}`,
      type: 'cot',
      title: 'COT Analysis',
      assetId: 'eurusd',
      x: 0,
      y: 0,
      w: 6,
      h: 6
    };
    
    setPanels([...panels, newPanel]);
    toast.success('COT Analysis panel added');
  };
  
  return (
    <div className="h-screen flex flex-col text-white overflow-hidden" style={{ backgroundColor: 'var(--bloomberg-blue)' }}>
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          collapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
        />
        
        <div className="flex-1 overflow-auto bloomberg-grid">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading market data...</p>
              </div>
            </div>
          ) : (
            <PanelGrid 
              panels={panels}
              assets={assets}
              onRemovePanel={handleRemovePanel}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
      </div>
      
      {/* Bloomberg-style command footer */}
      <div className="py-1 px-2 border-t border-[#2c3645] bg-[#111827]">
        <div className="flex justify-between items-center">
          <div className="text-[10px] text-[#8da2c0] font-mono">DHAHER TERMINAL PRO v1.0.5 | ALPHA VANTAGE API: ACTIVE | API KEY: QHZW****</div>
          <div className="text-[10px] text-[#8da2c0] font-mono">© 2025 DHAHER FINANCIAL TECHNOLOGY</div>
          <div className="text-[10px] text-[#8da2c0] font-mono">STATUS: <span className="text-[#00873c]">CONNECTED</span> | LAST UPDATE: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
        <button 
          onClick={sendWhatsAppNotification}
          className="w-10 h-10 bg-[#00873c] text-white flex items-center justify-center shadow-lg border border-[#2c3645]"
          title="Send Signal to WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 8.5 15.1L22 22l-4.9-1.5A10 10 0 1 1 12 2Z"></path>
            <path d="M16.1 9.7 15 8.6a1 1 0 0 0-1.4 0L10.4 12a1 1 0 0 0 0 1.4l1.2 1.2c.4.4 1 .4 1.4 0L16.1 11a1 1 0 0 0 0-1.3Z"></path>
          </svg>
        </button>
        
        <button 
          onClick={addNewPanel}
          className="w-10 h-10 bg-[#3a7ca5] text-white flex items-center justify-center shadow-lg border border-[#2c3645]"
          title="Add New Panel"
        >
          <Plus size={20} />
        </button>
        
        <button 
          className="w-10 h-10 bg-[#1a2437] text-white flex items-center justify-center shadow-lg border border-[#2c3645]"
          title="Dashboard Settings"
        >
          <Settings size={20} />
        </button>
      </div>
      
      <ToastContainer 
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
