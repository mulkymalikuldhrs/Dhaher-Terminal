import { Asset, Panel } from '../types';

export const mockAssets: Asset[] = [
  // Forex Major Pairs
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.0876,
    change: -0.0012,
    changePercent: -0.11,
    volume: 98432,
    high: 1.0895,
    low: 1.0865,
    category: 'forex_major',
    retailSentiment: {
      long: 43,
      short: 57,
    },
    cotPosition: {
      net: -15435,
      trend: 'short',
    },
    structure: {
      bias: 'bearish',
      lastEvent: 'BOS',
      lastLevel: 1.0912,
    },
    signals: [
      {
        id: 'sig1',
        assetId: 'eurusd',
        timestamp: Date.now() - 3600000,
        type: 'sell',
        strength: 'strong',
        price: 1.0895,
        reason: 'BOS + OB Rejection + COT Net Short',
        status: 'active',
      }
    ]
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    price: 1.2735,
    change: 0.0023,
    changePercent: 0.18,
    volume: 67542,
    high: 1.2749,
    low: 1.2698,
    category: 'forex_major',
    retailSentiment: {
      long: 62,
      short: 38,
    },
    cotPosition: {
      net: 8721,
      trend: 'long',
    },
    structure: {
      bias: 'bullish',
      lastEvent: 'CHoCH',
      lastLevel: 1.2698,
    }
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    price: 156.87,
    change: 0.54,
    changePercent: 0.34,
    volume: 84321,
    high: 157.12,
    low: 156.32,
    category: 'forex_major',
    retailSentiment: {
      long: 35,
      short: 65,
    },
    cotPosition: {
      net: 32145,
      trend: 'long',
    }
  },
  
  // Cryptocurrencies
  {
    id: 'btcusd',
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    price: 63542.87,
    change: 1235.42,
    changePercent: 1.98,
    volume: 28765432,
    high: 64123.45,
    low: 62354.21,
    category: 'crypto',
    retailSentiment: {
      long: 67,
      short: 33,
    },
    structure: {
      bias: 'bullish',
      lastEvent: 'Sweep + BOS',
      lastLevel: 63500,
    },
    signals: [
      {
        id: 'sig2',
        assetId: 'btcusd',
        timestamp: Date.now() - 1800000,
        type: 'buy',
        strength: 'strong',
        price: 62500,
        reason: 'Sweep + BOS + OB H1 + Retail Short',
        status: 'active',
      }
    ]
  },
  {
    id: 'ethusd',
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    price: 3452.18,
    change: 87.32,
    changePercent: 2.59,
    volume: 12453678,
    high: 3487.54,
    low: 3362.87,
    category: 'crypto',
    retailSentiment: {
      long: 72,
      short: 28,
    }
  },
  
  // Commodities
  {
    id: 'xauusd',
    symbol: 'XAU/USD',
    name: 'Gold / US Dollar',
    price: 2365.42,
    change: -12.35,
    changePercent: -0.52,
    volume: 178234,
    high: 2379.87,
    low: 2358.63,
    category: 'commodities',
    retailSentiment: {
      long: 58,
      short: 42,
    },
    cotPosition: {
      net: 43267,
      trend: 'long',
    }
  },
  
  // Indices
  {
    id: 'nas100',
    symbol: 'NAS100',
    name: 'NASDAQ 100',
    price: 19876.42,
    change: 187.63,
    changePercent: 0.95,
    volume: 854732,
    high: 19921.87,
    low: 19754.21,
    category: 'indices',
    retailSentiment: {
      long: 47,
      short: 53,
    }
  },
  {
    id: 'spx500',
    symbol: 'SPX500',
    name: 'S&P 500',
    price: 5437.21,
    change: 23.87,
    changePercent: 0.44,
    volume: 1243657,
    high: 5452.36,
    low: 5412.85,
    category: 'indices',
    retailSentiment: {
      long: 52,
      short: 48,
    },
    structure: {
      bias: 'bullish',
      lastEvent: 'FVG Fill',
      lastLevel: 5412.85,
    }
  }
];

export const defaultPanels: Panel[] = [
  {
    id: 'watchlist-panel',
    type: 'watchlist',
    title: 'Market Overview',
    x: 0,
    y: 0,
    w: 6,
    h: 6
  },
  {
    id: 'chart-panel-btc',
    type: 'chart',
    title: 'BTC/USD Chart',
    assetId: 'btcusd',
    x: 6,
    y: 0,
    w: 6,
    h: 9
  },
  {
    id: 'signals-panel',
    type: 'signals',
    title: 'Latest Signals',
    x: 0,
    y: 6,
    w: 6,
    h: 6
  },
  {
    id: 'sentiment-panel',
    type: 'sentiment',
    title: 'Market Sentiment',
    x: 0,
    y: 12,
    w: 6,
    h: 6
  },
  {
    id: 'structure-panel',
    type: 'market_structure',
    title: 'Market Structure Analysis',
    assetId: 'btcusd',
    x: 6,
    y: 9,
    w: 6,
    h: 6
  },
  {
    id: 'heatmap-panel',
    type: 'heatmap',
    title: 'Market Heatmap',
    x: 6,
    y: 15,
    w: 6,
    h: 6
  },
  {
    id: 'economic-calendar-panel',
    type: 'economic_calendar',
    title: 'Economic Calendar',
    x: 0,
    y: 18,
    w: 6,
    h: 6
  },
  {
    id: 'cot-panel',
    type: 'cot',
    title: 'COT Analysis',
    assetId: 'eurusd',
    x: 6,
    y: 21,
    w: 6,
    h: 6
  }
];

// Generate random candlestick data
export const generateCandlestickData = (days = 30, startPrice = 100) => {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    const volatility = Math.random() * 2;
    const changePercent = (Math.random() * 2 - 1) * volatility;
    const change = currentPrice * (changePercent / 100);
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * Math.abs(open - close) * 0.5;
    const low = Math.min(open, close) - Math.random() * Math.abs(open - close) * 0.5;
    
    data.push({
      time: date.getTime() / 1000,
      open,
      high,
      low,
      close
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate intraday data (1-minute intervals)
export const generateIntradayData = (hours = 24, startPrice = 100) => {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = hours * 60; i >= 0; i--) {
    const date = new Date();
    date.setMinutes(now.getMinutes() - i);
    
    const volatility = Math.random() * 0.5;
    const changePercent = (Math.random() * 2 - 1) * volatility;
    const change = currentPrice * (changePercent / 100);
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * Math.abs(open - close) * 0.3;
    const low = Math.min(open, close) - Math.random() * Math.abs(open - close) * 0.3;
    
    data.push({
      time: date.getTime() / 1000,
      open,
      high,
      low,
      close
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate a chart for a specific asset with realistic price movements
export const getAssetChartData = (assetId: string, timeframe = 'daily') => {
  const asset = mockAssets.find(a => a.id === assetId);
  if (!asset) return [];
  
  let startPrice = asset.price * 0.9; // Start 10% below current price
  
  if (timeframe === 'daily') {
    return generateCandlestickData(90, startPrice);
  } else {
    return generateIntradayData(24, startPrice);
  }
};

// Generate COT (Commitment of Traders) data
export const generateCOTData = (weeks = 52) => {
  const data = [];
  const now = new Date();
  let netPosition = Math.floor(Math.random() * 50000) - 25000;
  
  for (let i = weeks; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - (i * 7));
    
    const change = Math.floor((Math.random() * 10000) - 5000);
    netPosition += change;
    
    const nonCommercialLong = Math.max(100000 + netPosition, 50000);
    const nonCommercialShort = Math.max(100000 - netPosition, 50000);
    
    data.push({
      date: date.getTime(),
      netPosition,
      nonCommercialLong,
      nonCommercialShort
    });
  }
  
  return data;
};
