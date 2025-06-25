import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Check, CircleX } from 'lucide-react';
import { Asset, PanelProps, Signal } from '../../types';
import { useSignals } from '../../hooks/useMarketData';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../notifications/NotificationService';
import { toast } from 'react-toastify';

export default function SignalsPanel({ assets }: PanelProps) {
  const { addNotification } = useNotifications();
  const [showTestButton, setShowTestButton] = useState(false);
  const { signals, loading, error } = useSignals();
  
  // Sort signals by timestamp, newest first
  const sortedSignals = signals.sort((a, b) => b.timestamp - a.timestamp);
  
  // Function to notify user of a signal
  const notifySignal = (signal: Signal & { asset: Asset }) => {
    addNotification({
      type: 'signal',
      title: `${signal.type.toUpperCase()} Signal: ${signal.asset.symbol}`,
      message: signal.reason,
      data: signal
    });
    
    toast.success(`${signal.type.toUpperCase()} Signal sent for ${signal.asset.symbol}`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };
  
  // Real-time signal simulation
  useEffect(() => {
    const signalInterval = setInterval(() => {
      if (Math.random() > 0.85 && sortedSignals.length > 0) { // 15% chance
        // Select random signal to notify about
        const randomIndex = Math.floor(Math.random() * Math.min(sortedSignals.length, 3));
        notifySignal(sortedSignals[randomIndex]);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(signalInterval);
  }, [sortedSignals]);
  
  // Show test button on panel hover
  const handleMouseEnter = () => setShowTestButton(true);
  const handleMouseLeave = () => setShowTestButton(false);
  
  const getStatusIcon = (status: Signal['status']) => {
    switch (status) {
      case 'active':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'invalidated':
        return <CircleX size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStrengthBadge = (strength: Signal['strength']) => {
    switch (strength) {
      case 'strong':
        return <span className="px-2 py-0.5 text-xs rounded bg-green-900 text-green-300">Strong</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xs rounded bg-yellow-900 text-yellow-300">Medium</span>;
      case 'weak':
        return <span className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300">Weak</span>;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="h-full flex flex-col overflow-hidden bloomberg-panel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div>TRADING SIGNALS</div>
        <div className="flex items-center space-x-2">
          <div className="text-[10px] font-normal">{sortedSignals.length} SIGNALS</div>
          {(showTestButton || sortedSignals.length === 0) && (
            <button 
              onClick={() => sortedSignals.length > 0 ? notifySignal(sortedSignals[0]) : 
                addNotification({
                  type: 'system',
                  title: 'No Active Signals',
                  message: 'No trading signals are currently available. We will notify you when new signals appear.',
                })
              }
              className="p-0.5 hover:bg-[#2d5986] text-[#8da2c0] hover:text-white"
              title="Test notification"
            >
              <Bell size={12} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {sortedSignals.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {sortedSignals.map((signal) => (
              <div key={signal.id} className="p-3 hover:bg-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-200">{signal.asset.symbol}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      signal.type === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {signal.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(signal.status)}
                    <span className="ml-1 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(signal.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-1">{signal.reason}</div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Price: <span className="text-gray-300 font-mono">{signal.price.toFixed(signal.asset.category === 'crypto' ? 2 : 4)}</span>
                  </div>
                  <div>
                    {getStrengthBadge(signal.strength)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No signals available
          </div>
        )}
      </div>
    </div>
  );
}
