<<<<<<< HEAD
// Enhanced Dashboard for Dhaher Terminal Pro v2.0
// Complete Bloomberg-style trading terminal with advanced features

=======
// @ts-nocheck
>>>>>>> main
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { 
  Plus, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Wifi, 
  WifiOff,
  Play,
  Pause,
  RefreshCw,
  Monitor,
  BarChart3,
  Newspaper,
  Calendar,
  Brain,
  Target,
  Layers
} from 'lucide-react';

// Import enhanced components
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import PanelGrid from '../components/layout/PanelGrid';
import { useNotifications } from '../components/notifications/NotificationService';
import { webNotificationService } from '../services/notificationService';

// Import enhanced store
import { 
  useMarketStore,
  useMarketActions,
  useIsLoading,
  useErrors,
  useIsConnected,
  useCryptoData,
  useForexData,
  useIndicesData,
  useCommoditiesData,
  useSignals
} from '../store/marketStore';

// Import types
import { Panel, Asset, AssetCategory } from '../types';

// Import data adapters
import { marketDataArrayToAssets, filterAssetsByCategory } from '../utils/dataAdapters';

import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  // Local state for UI
  const [panels, setPanels] = useState<Panel[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);

  // Global state from store
  const store = useMarketStore();
  const actions = useMarketActions();
  const isLoading = useIsLoading();
  const errors = useErrors();
  const isConnected = useIsConnected();
  const cryptoData = useCryptoData();
  const forexData = useForexData();
  const indicesData = useIndicesData();
  const commoditiesData = useCommoditiesData();
  const signals = useSignals();

  // Notifications
  const { addNotification } = useNotifications();
<<<<<<< HEAD

  // Initialize dashboard
  useEffect(() => {
    // Load initial data
    actions.fetchAllMarketData();
    
    // Set up default panels
    const defaultPanels: Panel[] = [
      {
        id: 'watchlist-1',
        type: 'watchlist',
        title: 'Market Overview',
        x: 0,
        y: 0,
        w: 4,
        h: 6
      },
      {
        id: 'chart-1',
        type: 'chart',
        title: 'BTC/USD',
        assetId: 'bitcoin',
        x: 4,
        y: 0,
        w: 8,
        h: 8
      },
      {
        id: 'sentiment-1',
        type: 'sentiment',
        title: 'Market Sentiment',
        x: 0,
        y: 6,
        w: 4,
        h: 4
      },
      {
        id: 'signals-1',
        type: 'signals',
        title: 'Trading Signals',
        x: 12,
        y: 0,
        w: 4,
        h: 6
      },
      {
        id: 'news-1',
        type: 'news',
        title: 'Market News',
        x: 0,
        y: 10,
        w: 6,
        h: 4
      },
      {
        id: 'heatmap-1',
        type: 'heatmap',
        title: 'Market Heatmap',
        x: 6,
        y: 8,
        w: 6,
        h: 6
      },
      {
        id: 'calendar-1',
        type: 'economic_calendar',
        title: 'Economic Calendar',
        x: 12,
        y: 6,
        w: 4,
        h: 8
      }
    ];
    
    setPanels(defaultPanels);
  }, [actions]);

  // Real-time updates
  useEffect(() => {
    if (store.liveUpdates) {
      const interval = setInterval(() => {
        actions.fetchAllMarketData();
        actions.generateSignals();
      }, store.updateInterval);

      return () => clearInterval(interval);
    }
  }, [store.liveUpdates, store.updateInterval, actions]);

  // Signal notifications
  useEffect(() => {
    if (signals.length > 0) {
      const latestSignal = signals[signals.length - 1];
      if (Date.now() - latestSignal.timestamp < 60000) { // If signal is less than 1 minute old
=======
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
>>>>>>> main
        addNotification({
          type: 'signal',
          title: `${latestSignal.type.toUpperCase()} Signal: ${latestSignal.symbol}`,
          message: `${latestSignal.reason} | Confidence: ${latestSignal.confidence}%`,
          priority: latestSignal.strength === 'strong' ? 'high' : 'medium'
        });
        
        // Send push notification to device
        webNotificationService.sendPriceAlert({
          symbol: asset.symbol,
          price: asset.price,
          change: changeType === 'rise' ? parseFloat(changePercent) : -parseFloat(changePercent),
          changePercent: changeType === 'rise' ? parseFloat(changePercent) : -parseFloat(changePercent)
        });
      }
<<<<<<< HEAD
    }
  }, [signals, addNotification]);

  // Connection monitoring
  useEffect(() => {
    if (!isConnected && connectionRetries < 3) {
      const retryTimeout = setTimeout(() => {
        setConnectionRetries(prev => prev + 1);
        actions.fetchAllMarketData();
      }, 5000 * (connectionRetries + 1));

      return () => clearTimeout(retryTimeout);
    }
  }, [isConnected, connectionRetries, actions]);

  // Error handling
  useEffect(() => {
    Object.entries(errors).forEach(([key, error]) => {
      toast.error(`${key}: ${error}`, {
        toastId: key // Prevent duplicate toasts
      });
    });
  }, [errors]);

  // Market data monitoring for significant moves
  useEffect(() => {
    const allData = [...cryptoData, ...forexData, ...indicesData, ...commoditiesData];
=======
      
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
>>>>>>> main
    
    allData.forEach(item => {
      if (Math.abs(item.changePercent) > 5) {
        const isPositive = item.changePercent > 0;
        addNotification({
          type: 'price',
          title: `${item.symbol} ${isPositive ? 'Surge' : 'Drop'}`,
          message: `${item.symbol} has ${isPositive ? 'gained' : 'lost'} ${Math.abs(item.changePercent).toFixed(2)}% in the last 24h`,
          priority: Math.abs(item.changePercent) > 10 ? 'high' : 'medium'
        });
      }
    });
  }, [cryptoData, forexData, indicesData, commoditiesData, addNotification]);

  // Panel management
  const handleRemovePanel = (id: string) => {
    setPanels(panels.filter(panel => panel.id !== id));
    toast.info('Panel removed');
  };

  const handleAddPanel = (type: string) => {
    const panelTypes: Record<string, Partial<Panel>> = {
      chart: {
        type: 'chart',
        title: 'New Chart',
        assetId: 'bitcoin',
        w: 8,
        h: 6
      },
      watchlist: {
        type: 'watchlist',
        title: 'Watchlist',
        w: 4,
        h: 6
      },
      news: {
        type: 'news',
        title: 'Market News',
        w: 6,
        h: 4
      },
      sentiment: {
        type: 'sentiment',
        title: 'Sentiment Analysis',
        w: 4,
        h: 4
      },
      signals: {
        type: 'signals',
        title: 'Trading Signals',
        w: 4,
        h: 6
      },
      heatmap: {
        type: 'heatmap',
        title: 'Market Heatmap',
        w: 6,
        h: 6
      },
      calendar: {
        type: 'economic_calendar',
        title: 'Economic Calendar',
        w: 4,
        h: 8
      },
      cot: {
        type: 'cot',
        title: 'COT Analysis',
        assetId: 'eurusd',
        w: 6,
        h: 6
      }
    };

    const panelConfig = panelTypes[type];
    if (!panelConfig) return;

    const newPanel: Panel = {
      id: `${type}-${Date.now()}`,
      x: 0,
      y: 0,
      ...panelConfig
    } as Panel;

    setPanels([...panels, newPanel]);
<<<<<<< HEAD
    toast.success(`${panelConfig.title} panel added`);
    setIsControlPanelOpen(false);
=======
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
>>>>>>> main
  };

  const handleToggleLiveUpdates = () => {
    if (store.liveUpdates) {
      actions.stopLiveUpdates();
      toast.info('Live updates stopped');
    } else {
      actions.startLiveUpdates();
      toast.success('Live updates started');
    }
  };

  const handleRefreshData = () => {
    actions.fetchAllMarketData();
    toast.info('Data refreshed');
  };

  const handleClearCache = () => {
    actions.clearCache();
    toast.info('Cache cleared');
  };

  const sendWhatsAppSignal = () => {
    if (signals.length > 0) {
      const latestSignal = signals[0];
      toast.success(`Signal sent: ${latestSignal.symbol} ${latestSignal.type.toUpperCase()}`, {
        icon: '📱'
      });
    } else {
      toast.warning('No signals available to send');
    }
  };

  // Convert market data to assets and combine
  const allMarketData = [...cryptoData, ...forexData, ...indicesData, ...commoditiesData];
  const allAssets: Asset[] = marketDataArrayToAssets(allMarketData);
  const filteredAssets = filterAssetsByCategory(allAssets, selectedCategory);

  return (
    <div className="h-screen flex flex-col text-white overflow-hidden bg-[#0c121c]">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
          collapsed={sidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 overflow-hidden relative">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center bg-[#0c121c]"
            >
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-[#8da2c0] text-lg">Loading market data...</p>
                <p className="text-[#6b7280] text-sm mt-2">Connecting to multiple data sources</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <PanelGrid 
                panels={panels}
                assets={allAssets}
                onRemovePanel={handleRemovePanel}
                selectedCategory={selectedCategory}
              />
            </motion.div>
          )}
        </div>
      </div>
      
<<<<<<< HEAD
      {/* Enhanced Bloomberg-style status footer */}
      <div className="py-2 px-4 border-t border-[#2c3645] bg-[#111827]">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center space-x-4 text-[#8da2c0]">
            <span>DHAHER TERMINAL PRO v2.0</span>
            <span className="flex items-center">
              {isConnected ? (
                <>
                  <Wifi size={12} className="mr-1 text-green-500" />
                  <span className="text-green-500">CONNECTED</span>
                </>
              ) : (
                <>
                  <WifiOff size={12} className="mr-1 text-red-500" />
                  <span className="text-red-500">DISCONNECTED</span>
                </>
              )}
            </span>
            <span>APIs: {Object.keys(errors).length === 0 ? 'ACTIVE' : 'PARTIAL'}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-[#8da2c0]">
            <span>SIGNALS: {signals.length}</span>
            <span>ASSETS: {allAssets.length}</span>
            <span>LAST UPDATE: {new Date(store.lastUpdate || Date.now()).toLocaleTimeString()}</span>
          </div>
          
          <div className="text-[#8da2c0]">
            © 2025 DHAHER FINANCIAL TECHNOLOGY
          </div>
        </div>
      </div>
      
      {/* Enhanced floating action buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        {/* Live updates toggle */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleLiveUpdates}
          className={`w-12 h-12 ${store.liveUpdates ? 'bg-green-600' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-lg border border-[#2c3645] transition-colors`}
          title={store.liveUpdates ? "Stop Live Updates" : "Start Live Updates"}
        >
          {store.liveUpdates ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        {/* Refresh data */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRefreshData}
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border border-[#2c3645]"
          title="Refresh Data"
        >
          <RefreshCw size={20} />
        </motion.button>

        {/* WhatsApp signal */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={sendWhatsAppSignal}
          className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg border border-[#2c3645]"
=======
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
>>>>>>> main
          title="Send Signal to WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.105"/>
          </svg>
        </motion.button>
        
<<<<<<< HEAD
        {/* Control panel toggle */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
          className="w-12 h-12 bg-[#3a7ca5] text-white rounded-full flex items-center justify-center shadow-lg border border-[#2c3645]"
          title="Panel Controls"
=======
        <button 
          onClick={addNewPanel}
          className="w-10 h-10 bg-[#3a7ca5] text-white flex items-center justify-center shadow-lg border border-[#2c3645] hover:bg-[#4a8cb5] transition-colors"
          title="Add New Panel"
>>>>>>> main
        >
          <Plus size={20} />
        </motion.button>
        
<<<<<<< HEAD
        {/* Settings */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-[#1a2437] text-white rounded-full flex items-center justify-center shadow-lg border border-[#2c3645]"
          title="Settings"
        >
          <Settings size={20} />
        </motion.button>
=======
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
>>>>>>> main
      </div>

      {/* Control Panel */}
      <AnimatePresence>
        {isControlPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-6 w-80 bg-[#1a2437] border border-[#2c3645] rounded-lg shadow-2xl z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-white">Add Panel</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'chart', icon: BarChart3, label: 'Chart' },
                  { type: 'watchlist', icon: Monitor, label: 'Watchlist' },
                  { type: 'news', icon: Newspaper, label: 'News' },
                  { type: 'calendar', icon: Calendar, label: 'Calendar' },
                  { type: 'sentiment', icon: Brain, label: 'Sentiment' },
                  { type: 'signals', icon: Target, label: 'Signals' },
                  { type: 'heatmap', icon: Layers, label: 'Heatmap' },
                  { type: 'cot', icon: TrendingUp, label: 'COT' }
                ].map(({ type, icon: Icon, label }) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddPanel(type)}
                    className="p-3 bg-[#2c3645] hover:bg-[#3c4751] rounded-lg text-white text-sm flex flex-col items-center space-y-2 transition-colors"
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2c3645]">
                <button
                  onClick={handleClearCache}
                  className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Toast Container */}
      <ToastContainer 
        position="bottom-left"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1a2437',
          border: '1px solid #2c3645',
          color: '#fff'
        }}
      />
    </div>
  );
}
