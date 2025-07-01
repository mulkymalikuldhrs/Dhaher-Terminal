export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  category: AssetCategory;
  retailSentiment: {
    long: number;
    short: number;
  };
  cotPosition?: {
    net: number;
    trend: 'long' | 'short' | 'neutral';
  };
  structure?: {
    bias: 'bullish' | 'bearish' | 'neutral';
    lastEvent: string;
    lastLevel: number;
  };
  signals?: Signal[];
}

export type AssetCategory = 
  | 'forex_major' 
  | 'forex_cross' 
  | 'forex_exotic' 
  | 'commodities' 
  | 'indices' 
  | 'crypto';

export interface Signal {
  id: string;
  assetId: string;
  timestamp: number;
  type: 'buy' | 'sell';
  strength: 'weak' | 'medium' | 'strong';
  price: number;
  reason: string;
  status: 'active' | 'completed' | 'invalidated';
}

export interface Panel {
  id: string;
  type: PanelType;
  title: string;
  assetId?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PanelType = 
  | 'chart' 
  | 'watchlist' 
  | 'heatmap' 
  | 'liquidity' 
  | 'sentiment' 
  | 'cot' 
  | 'signals' 
  | 'market_structure'
  | 'economic_calendar'
  | 'orderflow'
  | 'news';

export interface PanelProps {
  panel: Panel;
  assets: Asset[];
  onClose: (id: string) => void;
  onResize?: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  watchlist: string[];
  preferences: {
    language: 'en' | 'id';
    theme: 'dark' | 'light';
    notifications: boolean;
  };
}
