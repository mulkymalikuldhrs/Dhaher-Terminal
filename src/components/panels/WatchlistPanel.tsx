import { useState, useEffect } from 'react';
import { Bell, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Asset, AssetCategory, PanelProps } from '../../types';
import { useNotifications } from '../notifications/NotificationService';
import { toast } from 'react-toastify';

interface WatchlistPanelProps extends Omit<PanelProps, 'panel'> {
  selectedCategory: AssetCategory | 'all';
}

export default function WatchlistPanel({ assets, selectedCategory }: WatchlistPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Asset, direction: 'asc' | 'desc' } | null>(null);
  const { addNotification } = useNotifications();

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key;
    
    if (a[key] < b[key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Asset) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Asset) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bloomberg-panel">
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div>WATCHLIST</div>
        <div className="text-[10px] font-normal">DHAHER SECURITIES LLC</div>
      </div>
      <div className="p-2 border-b border-[#2c3645] flex items-center bg-[#111827]">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#8da2c0]" />
          <input
            type="text"
            placeholder="FIND..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f1829] text-white text-xs py-1 pl-7 pr-2 focus:outline-none border border-[#2c3645] font-mono"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#111827] text-[#8da2c0]">
            <tr>
              <th 
                className="px-2 py-1 text-left cursor-pointer hover:bg-[#1e293b]"
                onClick={() => requestSort('symbol')}
              >
                <div className="flex items-center">
                  <span className="font-semibold text-[10px] uppercase tracking-wider">Symbol</span>
                  {getSortIcon('symbol')}
                </div>
              </th>
              <th 
                className="px-2 py-1 text-right cursor-pointer hover:bg-[#1e293b]"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center justify-end">
                  <span className="font-semibold text-[10px] uppercase tracking-wider">Price</span>
                  {getSortIcon('price')}
                </div>
              </th>
              <th 
                className="px-2 py-1 text-right cursor-pointer hover:bg-[#1e293b]"
                onClick={() => requestSort('changePercent')}
              >
                <div className="flex items-center justify-end">
                  <span className="font-semibold text-[10px] uppercase tracking-wider">Chg %</span>
                  {getSortIcon('changePercent')}
                </div>
              </th>
              <th className="px-2 py-1 text-center">
                <span className="font-semibold text-[10px] uppercase tracking-wider">Sent</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[#e0e0e0]">
            {sortedAssets.map((asset) => (
              <tr 
                key={asset.id} 
                className="border-b border-[#2c3645] hover:bg-[#1e293b] cursor-pointer"
                onClick={() => {
                  // Simulate clicking on a watchlist item to view details
                  toast.info(`${asset.symbol} selected for analysis`, {
                    position: "bottom-right",
                    autoClose: 1500,
                  });
                }}
              >
                <td className="px-2 py-1">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium bloomberg-mono">{asset.symbol}</div>
                      <div className="text-[10px] text-[#8da2c0]">{asset.name}</div>
                    </div>
                    {asset.signals && asset.signals.length > 0 && (
                      <button 
                        className="ml-1 p-0.5 hover:bg-[#2d5986] text-[#d4ac0d]"
                        title="Has active signals"
                        onClick={(e) => {
                          e.stopPropagation();
                          addNotification({
                            type: 'signal',
                            title: `${asset.signals[0].type.toUpperCase()} Signal: ${asset.symbol}`,
                            message: asset.signals[0].reason,
                            data: asset.signals[0]
                          });
                        }}
                      >
                        <Bell size={12} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1 text-right bloomberg-mono">{asset.price.toFixed(asset.category === 'crypto' ? 2 : 4)}</td>
                <td className={`px-2 py-1 text-right bloomberg-mono ${asset.changePercent >= 0 ? 'bloomberg-positive' : 'bloomberg-negative'}`}>
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </td>
                <td className="px-2 py-1">
                  <div className="flex justify-center items-center space-x-0.5">
                    <div className="h-1 bg-[#00873c]" style={{ width: `${asset.retailSentiment.long}%` }}></div>
                    <div className="h-1 bg-[#c91a1a]" style={{ width: `${asset.retailSentiment.short}%` }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
