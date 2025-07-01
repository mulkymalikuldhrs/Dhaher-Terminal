// Data Adapters for Dhaher Terminal Pro v2.0
// Convert between different data formats for compatibility

import { MarketData } from '../services/dataService';
import { Asset, AssetCategory } from '../types';

/**
 * Convert MarketData to Asset for backward compatibility
 */
export function marketDataToAsset(marketData: MarketData, category: AssetCategory): Asset {
  return {
    id: marketData.symbol.toLowerCase().replace(/[^a-z0-9]/g, ''),
    symbol: marketData.symbol,
    name: `${marketData.symbol} - ${marketData.source}`,
    price: marketData.price,
    change: marketData.change,
    changePercent: marketData.changePercent,
    volume: marketData.volume,
    high: marketData.high24h,
    low: marketData.low24h,
    category,
    retailSentiment: {
      long: Math.floor(Math.random() * 40) + 30, // Mock sentiment data
      short: Math.floor(Math.random() * 40) + 30
    },
    structure: {
      bias: marketData.changePercent >= 0 ? 'bullish' : 'bearish',
      lastEvent: marketData.changePercent >= 0 ? 'BOS' : 'Sweep',
      lastLevel: marketData.price * 0.99
    }
  };
}

/**
 * Convert array of MarketData to Asset array with category detection
 */
export function marketDataArrayToAssets(data: MarketData[]): Asset[] {
  return data.map(item => {
    // Detect category based on symbol patterns
    let category: AssetCategory = 'crypto'; // default
    
    if (item.symbol.includes('/')) {
      if (['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'].includes(item.symbol)) {
        category = 'forex_major';
      } else if (['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CAD/JPY'].includes(item.symbol)) {
        category = 'forex_cross';
      } else if (item.symbol.includes('USD')) {
        category = 'forex_exotic';
      }
    } else if (['SPX', 'NASDAQ', 'DOW', 'FTSE', 'DAX', 'NIKKEI'].includes(item.symbol)) {
      category = 'indices';
    } else if (['GOLD', 'SILVER', 'OIL', 'NATURAL_GAS', 'COPPER'].includes(item.symbol)) {
      category = 'commodities';
    }
    
    return marketDataToAsset(item, category);
  });
}

/**
 * Filter assets by category
 */
export function filterAssetsByCategory(assets: Asset[], category: string): Asset[] {
  if (category === 'all') {
    return assets;
  }
  return assets.filter(asset => asset.category === category);
}

/**
 * Get unique categories from assets
 */
export function getUniqueCategories(assets: Asset[]): AssetCategory[] {
  const categories = assets.map(asset => asset.category);
  return [...new Set(categories)];
}

/**
 * Sort assets by various criteria
 */
export function sortAssets(assets: Asset[], sortBy: 'name' | 'price' | 'change' | 'volume' = 'name'): Asset[] {
  return [...assets].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'change':
        return b.changePercent - a.changePercent;
      case 'volume':
        return b.volume - a.volume;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });
}

/**
 * Format price based on asset type
 */
export function formatPrice(price: number, category: AssetCategory): string {
  if (category.includes('forex')) {
    return price.toFixed(5);
  } else if (category === 'crypto' && price < 1) {
    return price.toFixed(6);
  } else if (category === 'crypto') {
    return price.toFixed(2);
  } else {
    return price.toFixed(2);
  }
}

/**
 * Format volume with units
 */
export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  } else {
    return volume.toFixed(0);
  }
}

/**
 * Get color based on change percentage
 */
export function getChangeColor(changePercent: number): string {
  if (changePercent > 0) {
    return '#00ff88'; // Green for positive
  } else if (changePercent < 0) {
    return '#ff4757'; // Red for negative
  } else {
    return '#ffffff'; // White for neutral
  }
}

/**
 * Get market status based on time
 */
export function getMarketStatus(category: AssetCategory): 'open' | 'closed' | 'pre-market' | 'after-hours' {
  const now = new Date();
  const hours = now.getUTCHours();
  
  switch (category) {
    case 'crypto':
      return 'open'; // Crypto markets are always open
    case 'forex_major':
    case 'forex_cross':
    case 'forex_exotic':
      // Forex is open 24/5, closed on weekends
      const day = now.getUTCDay();
      if (day === 0 || day === 6) return 'closed';
      return 'open';
    case 'indices':
    case 'commodities':
      // US market hours (14:30-21:00 UTC)
      if (hours >= 14.5 && hours <= 21) {
        return 'open';
      } else if (hours >= 9 && hours < 14.5) {
        return 'pre-market';
      } else {
        return 'after-hours';
      }
    default:
      return 'open';
  }
}