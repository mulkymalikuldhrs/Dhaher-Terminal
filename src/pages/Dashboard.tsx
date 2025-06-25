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
import { webNotificationService } from '../services/notificationService';

export default function Dashboard() {
  const [panels, setPanels] = useState<Panel[]>(defaultPanels);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const { addNotification } = useNotifications();
  const { assets, loading, error } = useMarketData(selectedCategory);
  
  // Initialize push notifications on mount
  useEffect(() => {
    const initNotifications = async () => {
      const granted = await webNotificationService.requestPermission();
      if (granted) {
        toast.success('Push notifications enabled! You will receive real-time alerts.', {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };
    
    initNotifications();
  }, []);

  // Simulate real-time market updates with push notifications
  useEffect(() => {
    const marketUpdateInterval = setInterval(() => {
      // Simulate occasional market update
      if (Math.random() > 0.85 && assets.length > 0) {
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const changeType = Math.random() > 0.5 ? 'rise' : 'fall';
        const changePercent = (Math.random() * 2).toFixed(2);
        
        // Send in-app notification
        addNotification({
          type: 'price',
          title: `${asset.symbol} ${changeType === 'rise' ? 'Rising' : 'Falling'} Rapidly`,
          message: `${asset.symbol} has ${changeType === 'rise' ? 'increased' : 'decreased'} by ${changePercent}% in the last 5 minutes.`
        });
        
        // Send push notification to device
        webNotificationService.sendPriceAlert({
          symbol: asset.symbol,
          price: asset.price,
          change: changeType === 'rise' ? parseFloat(changePercent) : -parseFloat(changePercent),
          changePercent: changeType === 'rise' ? parseFloat(changePercent) : -parseFloat(changePercent)
        });
      }
      
      // Generate trading signals
      if (Math.random() > 0.92 && assets.length > 0) {
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const signalType = Math.random() > 0.5 ? 'buy' : 'sell';
        const strength = Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak';
        const reasons = [
          'SMC BOS + OB Confluence',
          'Liquidity Sweep Detected',
          'COT Institutional Bias',
          'Support/Resistance Break',
          'Order Block Reaction'
        ];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        
        // Send signal notification
        webNotificationService.sendSignalNotification({
          symbol: asset.symbol,
          type: signalType,
          price: asset.price,
          reason,
          strength: strength as 'weak' | 'medium' | 'strong'
        });
        
        addNotification({
          type: 'signal',
          title: `${signalType.toUpperCase()} Signal: ${asset.symbol}`,
          message: `${reason} - Strength: ${strength.toUpperCase()}`
        });
      }
      
      // Generate news notifications
      if (Math.random() > 0.95) {
        const newsItems = [
          { title: 'Fed Meeting Minutes Released', impact: 'high', currencies: ['USD'] },
          { title: 'ECB Policy Decision', impact: 'high', currencies: ['EUR'] },
          { title: 'GDP Data Released', impact: 'medium', currencies: ['USD', 'EUR'] },
          { title: 'Employment Report', impact: 'high', currencies: ['USD'] },
          { title: 'Inflation Data', impact: 'medium', currencies: ['USD', 'EUR', 'GBP'] }
        ];
        const news = newsItems[Math.floor(Math.random() * newsItems.length)];
        
        webNotificationService.sendNewsNotification({
          title: news.title,
          summary: `Market moving event detected. Check your positions for ${news.currencies.join(', ')} exposure.`,
          impact: news.impact as 'low' | 'medium' | 'high',
          currency: news.currencies.join(', ')
        });
      }
    }, 45000); // Check every 45 seconds
    
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
    // For demo purposes, we'll just show a toast and send push notification
    toast.info('Signal sent to WhatsApp', {
      icon: '📱'
    });
    
    // Send a demo trading signal
    webNotificationService.sendSignalNotification({
      symbol: 'EUR/USD',
      type: 'buy',
      price: 1.0876,
      reason: 'Manual Signal - BOS + OB Confluence',
      strength: 'strong'
    });
  };

  const testNotifications = async () => {
    await webNotificationService.sendTestNotification();
    toast.success('Test notification sent!', {
      position: "bottom-right",
      autoClose: 2000,
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
          <div className="text-[10px] text-[#8da2c0] font-mono">© 2025 MULKY MALIKUL DHAHER | mulkymalikuldhr@mail.com</div>
          <div className="text-[10px] text-[#8da2c0] font-mono">STATUS: <span className="text-[#00873c]">CONNECTED</span> | LAST UPDATE: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
        <button 
          onClick={testNotifications}
          className="w-10 h-10 bg-[#d4ac0d] text-white flex items-center justify-center shadow-lg border border-[#2c3645] hover:bg-[#e4bc1d] transition-colors"
          title="Test Push Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
        </button>
        
        <button 
          onClick={sendWhatsAppNotification}
          className="w-10 h-10 bg-[#00873c] text-white flex items-center justify-center shadow-lg border border-[#2c3645] hover:bg-[#059942] transition-colors"
          title="Send Signal to WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 8.5 15.1L22 22l-4.9-1.5A10 10 0 1 1 12 2Z"></path>
            <path d="M16.1 9.7 15 8.6a1 1 0 0 0-1.4 0L10.4 12a1 1 0 0 0 0 1.4l1.2 1.2c.4.4 1 .4 1.4 0L16.1 11a1 1 0 0 0 0-1.3Z"></path>
          </svg>
        </button>
        
        <button 
          onClick={addNewPanel}
          className="w-10 h-10 bg-[#3a7ca5] text-white flex items-center justify-center shadow-lg border border-[#2c3645] hover:bg-[#4a8cb5] transition-colors"
          title="Add New Panel"
        >
          <Plus size={20} />
        </button>
        
        <button 
          onClick={addNewEconomicCalendarPanel}
          className="w-10 h-10 bg-[#8b5cf6] text-white flex items-center justify-center shadow-lg border border-[#2c3645] hover:bg-[#9b6cf6] transition-colors"
          title="Add Economic Calendar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </button>
        
        <button 
          onClick={addNewCOTPanel}
          className="w-10 h-10 bg-[#f59e0b] text-white flex items-center justify-center shadow-lg border border-[#2c3645] hover:bg-[#f5a50b] transition-colors"
          title="Add COT Analysis"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
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
