import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { Signal, Asset } from '../../types';
import { Bell, TrendingDown, TrendingUp } from 'lucide-react';

type NotificationType = 'signal' | 'price' | 'news' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Check if browser notifications are supported and permissions
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    // Check notification permission on mount
    requestNotificationPermission().then(setHasPermission);
    
    // Mock real-time signal notifications
    const signalInterval = setInterval(() => {
      const random = Math.random();
      if (random > 0.85) { // 15% chance of receiving a notification
        const mockSignal = generateMockSignal();
        addNotification({
          type: 'signal',
          title: `${mockSignal.type === 'buy' ? 'BUY' : 'SELL'} Signal: ${mockSignal.asset.symbol}`,
          message: mockSignal.reason,
          data: mockSignal
        });
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(signalInterval);
    };
  }, []);
  
  const generateMockSignal = (): Signal & { asset: Asset } => {
    const assets = [
      { id: 'eurusd', symbol: 'EUR/USD', category: 'forex_major' },
      { id: 'gbpusd', symbol: 'GBP/USD', category: 'forex_major' },
      { id: 'btcusd', symbol: 'BTC/USD', category: 'crypto' },
      { id: 'xauusd', symbol: 'XAU/USD', category: 'commodities' }
    ] as Asset[];
    
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const reasons = [
      'Bullish engulfing pattern detected',
      'Bearish divergence on RSI',
      'Liquidity grab followed by reversal',
      'Break of structure with SMC confirmation',
      'FVG fill with strong rejection',
      'Order block test with volume confirmation'
    ];
    
    return {
      id: `sig-${Date.now()}`,
      assetId: asset.id,
      timestamp: Date.now(),
      type: type as 'buy' | 'sell',
      strength: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak',
      price: type === 'buy' ? 1.2345 : 1.2355,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: 'active',
      asset
    };
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    const toastOptions: ToastOptions = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    };
    
    const ToastContent = () => (
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {notification.type === 'signal' && notification.data?.type === 'buy' ? 
            <TrendingUp size={20} className="text-green-400" /> : 
            notification.type === 'signal' ? 
            <TrendingDown size={20} className="text-red-400" /> : 
            <Bell size={20} className="text-blue-400" />
          }
        </div>
        <div>
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-gray-300">{notification.message}</div>
        </div>
      </div>
    );
    
    toast(<ToastContent />, toastOptions);
    
    // Send browser notification if permission granted
    if (hasPermission) {
      try {
        // Play notification sound for important alerts
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio playback prevented by browser policy'));
        
        // Show browser notification with proper icon
        const notification = new Notification(notification.title, {
          body: notification.message,
          icon: notification.type === 'signal' 
            ? '/signal-notification-icon.png' 
            : '/notification-icon.png',
          badge: '/badge-icon.png',
          vibrate: [200, 100, 200],
          tag: `dhaher-terminal-${notification.type}-${Date.now()}`
        });
        
        // Handle notification click
        notification.onclick = function() {
          window.focus();
          this.close();
        };
      } catch (error) {
        console.error('Error sending browser notification:', error);
        
        // Fallback to toast notification if browser notification fails
        toast.info(`${notification.title}: ${notification.message}`, {
          position: "bottom-right",
          autoClose: 5000
        });
      }
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
