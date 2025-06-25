import { useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Panel, PanelProps } from '../../types';
import WatchlistPanel from '../panels/WatchlistPanel';
import ChartPanel from '../panels/ChartPanel';
import SignalsPanel from '../panels/SignalsPanel';
import SentimentPanel from '../panels/SentimentPanel';
import MarketStructurePanel from '../panels/MarketStructurePanel';
import HeatmapPanel from '../panels/HeatmapPanel';
import { Asset, AssetCategory } from '../../types';

interface PanelGridProps {
  panels: Panel[];
  assets: Asset[];
  onRemovePanel: (id: string) => void;
  selectedCategory: AssetCategory | 'all';
}

export default function PanelGrid({ panels, assets, onRemovePanel, selectedCategory }: PanelGridProps) {
  const [maximizedPanel, setMaximizedPanel] = useState<string | null>(null);
  
  const getPanelComponent = (panel: Panel) => {
    const commonProps: PanelProps = {
      panel,
      assets,
      onClose: () => onRemovePanel(panel.id)
    };
    
    switch (panel.type) {
      case 'watchlist':
        return <WatchlistPanel {...commonProps} selectedCategory={selectedCategory} />;
      case 'chart':
        return <ChartPanel {...commonProps} />;
      case 'signals':
        return <SignalsPanel {...commonProps} />;
      case 'sentiment':
        return <SentimentPanel {...commonProps} />;
      case 'market_structure':
        return <MarketStructurePanel {...commonProps} />;
      case 'heatmap':
        return <HeatmapPanel {...commonProps} />;
      default:
        return <div>Unknown panel type</div>;
    }
  };
  
  const toggleMaximize = (panelId: string) => {
    if (maximizedPanel === panelId) {
      setMaximizedPanel(null);
    } else {
      setMaximizedPanel(panelId);
    }
  };
  
  // If a panel is maximized, show only that panel
  if (maximizedPanel) {
    const panel = panels.find(p => p.id === maximizedPanel);
    if (!panel) return null;
    
    return (
      <div className="fixed inset-0 z-50 p-4 bg-gray-900 bg-opacity-95">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={() => toggleMaximize(panel.id)}
            className="p-2 bg-gray-800 rounded-md text-gray-400 hover:text-white"
          >
            <Minimize2 size={18} />
          </button>
        </div>
        <div className="h-full">
          {getPanelComponent(panel)}
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-12 gap-2 p-2">
      {panels.map(panel => (
        <div
          key={panel.id}
          className="relative"
          style={{
            gridColumn: `span ${panel.w} / span ${panel.w}`,
            gridRowStart: panel.y + 1,
            gridRowEnd: panel.y + panel.h + 1,
            minHeight: `${panel.h * 100}px`,
          }}
        >
          <div className="absolute top-0 right-0 z-10 flex space-x-0.5 m-0.5">
            <button
              onClick={() => toggleMaximize(panel.id)}
              className="p-1 bg-[#1a2437] text-[#8da2c0] hover:text-white hover:bg-[#2d5986] border border-[#2c3645]"
              style={{ fontSize: '10px' }}
            >
              <Maximize2 size={12} />
            </button>
            <button
              onClick={() => onRemovePanel(panel.id)}
              className="p-1 bg-[#1a2437] text-[#8da2c0] hover:text-white hover:bg-[#2d5986] border border-[#2c3645]"
              style={{ fontSize: '10px' }}
            >
              <X size={12} />
            </button>
          </div>
          {getPanelComponent(panel)}
        </div>
      ))}
    </div>
  );
}
