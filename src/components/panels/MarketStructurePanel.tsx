import { useState, useEffect } from 'react';
import { Asset, PanelProps } from '../../types';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Layers, TrendingDown, TrendingUp } from 'lucide-react';

export default function MarketStructurePanel({ panel, assets }: PanelProps) {
  const [asset, setAsset] = useState<Asset | undefined>(undefined);
  
  useEffect(() => {
    if (!panel.assetId) return;
    
    const foundAsset = assets.find(a => a.id === panel.assetId);
    if (foundAsset) {
      setAsset(foundAsset);
    }
  }, [panel.assetId, assets]);
  
  if (!asset) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-md shadow-lg border border-gray-800 text-gray-500">
        No asset selected
      </div>
    );
  }
  
  const getBiasIndicator = () => {
    if (!asset.structure) return null;
    
    switch (asset.structure.bias) {
      case 'bullish':
        return (
          <div className="flex items-center bg-green-900/30 text-green-300 px-3 py-2 rounded-md">
            <TrendingUp size={18} className="mr-2" />
            <span>Bullish Bias</span>
          </div>
        );
      case 'bearish':
        return (
          <div className="flex items-center bg-red-900/30 text-red-300 px-3 py-2 rounded-md">
            <TrendingDown size={18} className="mr-2" />
            <span>Bearish Bias</span>
          </div>
        );
      case 'neutral':
        return (
          <div className="flex items-center bg-gray-800 text-gray-300 px-3 py-2 rounded-md">
            <AlertTriangle size={18} className="mr-2" />
            <span>Neutral Bias</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getMarketStructureEvents = () => {
    return [
      { 
        event: 'BOS (Break of Structure)', 
        description: 'Price breaking above a significant resistance level, confirming bullish continuation.',
        timeframe: 'H4',
        time: '2 hours ago'
      },
      { 
        event: 'FVG (Fair Value Gap)', 
        description: 'Unfilled price gap at 63,250 indicating potential support zone on pullbacks.',
        timeframe: 'H1',
        time: '4 hours ago'
      },
      { 
        event: 'CHoCH (Change of Character)', 
        description: 'Shift from lower lows to higher lows, signaling potential trend reversal.',
        timeframe: 'D1',
        time: '2 days ago'
      }
    ];
  };
  
  const getSentimentData = () => {
    return [
      { name: 'Retail', long: asset.retailSentiment.long, short: asset.retailSentiment.short },
      { name: 'COT', long: asset.cotPosition?.trend === 'long' ? 70 : 30, short: asset.cotPosition?.trend === 'short' ? 70 : 30 }
    ];
  };
  
  const events = getMarketStructureEvents();
  const sentimentData = getSentimentData();
  
  return (
    <div className="h-full flex flex-col overflow-hidden bloomberg-panel">
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div className="flex items-center">
          <Layers size={14} className="mr-1" />
          <span>{asset.symbol} STRUCTURE</span>
        </div>
        <div className="text-[10px] font-normal">SMC ANALYSIS</div>
      </div>
      
      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {getBiasIndicator()}
          
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="text-sm text-gray-400 mb-2">Last Event</div>
            <div className="text-lg font-semibold text-gray-200">{asset.structure?.lastEvent || 'N/A'}</div>
            <div className="text-sm text-gray-500">
              Level: <span className="text-gray-300 font-mono">{asset.structure?.lastLevel.toFixed(asset.category === 'crypto' ? 2 : 4) || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Market Sentiment</div>
          <div className="grid grid-cols-2 gap-2">
            {sentimentData.map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-md p-2">
                <div className="text-xs text-gray-500 mb-1">{item.name}</div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-green-400">{item.long}% Long</span>
                  <span className="text-xs text-red-400">{item.short}% Short</span>
                </div>
                <div className="flex h-1.5 rounded overflow-hidden">
                  <div className="bg-green-500" style={{ width: `${item.long}%` }}></div>
                  <div className="bg-red-500" style={{ width: `${item.short}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-2">Recent Structure Events</div>
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={index} className="bg-gray-800/50 rounded-md p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-200">{event.event}</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{event.timeframe}</span>
                    <span className="text-xs text-gray-500 ml-2">{event.time}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{event.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
