import axios from 'axios';
import { Asset, AssetCategory } from '../types';
import { API_KEYS, API_URLS } from './apiConfig';
import { toast } from 'react-toastify';

// Fetch commodities data from FCSAPI
export const fetchCommoditiesFromFCSAPI = async (): Promise<Asset[]> => {
  const commoditySymbols = ['GOLD', 'SILVER', 'USOIL', 'UKOIL', 'NGAS'];
  
  try {
    const response = await axios.get(`${API_URLS.FCSAPI}/commodities/latest`, {
      params: {
        symbol: commoditySymbols.join(','),
        access_key: API_KEYS.FCSAPI
      }
    });
    
    if (response.data && response.data.status && response.data.response) {
      const commodityData = response.data.response;
      const assets: Asset[] = [];
      
      commodityData.forEach((item: any) => {
        const price = parseFloat(item.price);
        const changePercent = parseFloat(item.chg_per);
        const change = parseFloat(item.chg);
        
        // Calculate high and low based on available data
        const high = price * (1 + Math.abs(changePercent) / 200);
        const low = price * (1 - Math.abs(changePercent) / 200);
        
        let assetName = item.name || item.symbol;
        let assetSymbol = item.symbol;
        
        // Format symbols for display
        if (item.symbol === 'GOLD') {
          assetSymbol = 'XAU/USD';
          assetName = 'Gold / US Dollar';
        } else if (item.symbol === 'SILVER') {
          assetSymbol = 'XAG/USD';
          assetName = 'Silver / US Dollar';
        } else if (item.symbol === 'USOIL') {
          assetSymbol = 'OIL/USD';
          assetName = 'US Crude Oil / US Dollar';
        } else if (item.symbol === 'NGAS') {
          assetSymbol = 'NAT/USD';
          assetName = 'Natural Gas / US Dollar';
        }
        
        assets.push({
          id: item.symbol.toLowerCase(),
          symbol: assetSymbol,
          name: assetName,
          price,
          change,
          changePercent,
          volume: parseInt(item.vol || '0') || Math.floor(Math.random() * 100000),
          high,
          low,
          category: 'commodities',
          retailSentiment: {
            long: Math.floor(Math.random() * 40) + 30, // Random sentiment for demo
            short: Math.floor(Math.random() * 40) + 30,
          }
        });
      });
      
      return assets;
    }
    
    throw new Error('Invalid response format from FCSAPI');
  } catch (error) {
    console.error('Error fetching commodity data from FCSAPI:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === 'commodities');
  }
};

// Fetch indices data from FCSAPI
export const fetchIndicesFromFCSAPI = async (): Promise<Asset[]> => {
  const indexSymbols = ['US500', 'US100', 'US30', 'UK100', 'JPN225'];
  
  try {
    const response = await axios.get(`${API_URLS.FCSAPI}/stock/indices`, {
      params: {
        symbol: indexSymbols.join(','),
        access_key: API_KEYS.FCSAPI
      }
    });
    
    if (response.data && response.data.status && response.data.response) {
      const indicesData = response.data.response;
      const assets: Asset[] = [];
      
      indicesData.forEach((item: any) => {
        const price = parseFloat(item.price);
        const changePercent = parseFloat(item.chg_per);
        const change = parseFloat(item.chg);
        
        // Calculate high and low based on available data
        const high = price * (1 + Math.abs(changePercent) / 200);
        const low = price * (1 - Math.abs(changePercent) / 200);
        
        let assetName = item.name || item.symbol;
        let assetSymbol = item.symbol;
        
        // Format symbols for display
        if (item.symbol === 'US500') {
          assetSymbol = 'SPX500';
          assetName = 'S&P 500';
        } else if (item.symbol === 'US100') {
          assetSymbol = 'NAS100';
          assetName = 'NASDAQ 100';
        } else if (item.symbol === 'US30') {
          assetSymbol = 'DJ30';
          assetName = 'Dow Jones Industrial Average';
        } else if (item.symbol === 'UK100') {
          assetSymbol = 'FTSE100';
          assetName = 'FTSE 100';
        } else if (item.symbol === 'JPN225') {
          assetSymbol = 'N225';
          assetName = 'Nikkei 225';
        }
        
        assets.push({
          id: item.symbol.toLowerCase(),
          symbol: assetSymbol,
          name: assetName,
          price,
          change,
          changePercent,
          volume: parseInt(item.vol || '0') || Math.floor(Math.random() * 1000000),
          high,
          low,
          category: 'indices',
          retailSentiment: {
            long: Math.floor(Math.random() * 40) + 30, // Random sentiment for demo
            short: Math.floor(Math.random() * 40) + 30,
          }
        });
      });
      
      return assets;
    }
    
    throw new Error('Invalid response format from FCSAPI');
  } catch (error) {
    console.error('Error fetching indices data from FCSAPI:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === 'indices');
  }
};

// Fetch cryptocurrency data from FCSAPI
export const fetchCryptoFromFCSAPI = async (): Promise<Asset[]> => {
  const cryptoSymbols = ['BTC/USD', 'ETH/USD', 'XRP/USD', 'BCH/USD', 'LTC/USD', 'BNB/USD', 'ADA/USD'];
  
  try {
    // Format the symbols for FCSAPI
    const symbols = cryptoSymbols.map(pair => pair.replace('/', '')).join(',');
    
    const response = await axios.get(`${API_URLS.FCSAPI}/crypto/latest`, {
      params: {
        symbol: symbols,
        access_key: API_KEYS.FCSAPI
      }
    });
    
    if (response.data && response.data.status && response.data.response) {
      const cryptoData = response.data.response;
      const assets: Asset[] = [];
      
      cryptoData.forEach((item: any) => {
        const symbol = item.symbol;
        const formattedSymbol = `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
        
        const price = parseFloat(item.price);
        const changePercent = parseFloat(item.chg_per);
        const change = parseFloat(item.chg);
        
        // Calculate high and low based on available data
        const high = price * (1 + Math.abs(changePercent) / 100);
        const low = price * (1 - Math.abs(changePercent) / 100);
        
        const cryptoName = item.name || formattedSymbol.split('/')[0];
        
        assets.push({
          id: symbol.toLowerCase(),
          symbol: formattedSymbol,
          name: `${cryptoName} / US Dollar`,
          price,
          change,
          changePercent,
          volume: parseInt(item.vol || '0') || Math.floor(Math.random() * 1000000),
          high,
          low,
          category: 'crypto',
          retailSentiment: {
            long: Math.floor(Math.random() * 40) + 30, // Random sentiment for demo
            short: Math.floor(Math.random() * 40) + 30,
          },
          structure: {
            bias: changePercent >= 0 ? 'bullish' : 'bearish',
            lastEvent: changePercent >= 0 ? 'BOS' : 'Sweep',
            lastLevel: price * 0.99,
          }
        });
      });
      
      return assets;
    }
    
    throw new Error('Invalid response format from FCSAPI');
  } catch (error) {
    console.error('Error fetching crypto data from FCSAPI:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === 'crypto');
  }
};

// Fetch chart data from FCSAPI
export const fetchChartDataFromFCSAPI = async (
  asset: Asset,
  timeframe: string
): Promise<any[]> => {
  try {
    // Map timeframe to FCSAPI period
    const period = timeframeToFCSAPIPeriod(timeframe);
    
    // Format the symbol based on asset category
    let symbol = asset.symbol.replace('/', '');
    
    // Determine the endpoint based on asset category
    let endpoint = '';
    if (asset.category.includes('forex')) {
      endpoint = 'forex/history';
    } else if (asset.category === 'crypto') {
      endpoint = 'crypto/history';
    } else if (asset.category === 'commodities') {
      // Map commodity symbols to FCSAPI format
      if (asset.symbol === 'XAU/USD') symbol = 'GOLD';
      else if (asset.symbol === 'XAG/USD') symbol = 'SILVER';
      else if (asset.symbol === 'OIL/USD') symbol = 'USOIL';
      else if (asset.symbol === 'NAT/USD') symbol = 'NGAS';
      
      endpoint = 'commodities/history';
    } else if (asset.category === 'indices') {
      // Map index symbols to FCSAPI format
      if (asset.symbol === 'SPX500') symbol = 'US500';
      else if (asset.symbol === 'NAS100') symbol = 'US100';
      else if (asset.symbol === 'DJ30') symbol = 'US30';
      else if (asset.symbol === 'FTSE100') symbol = 'UK100';
      else if (asset.symbol === 'N225') symbol = 'JPN225';
      
      endpoint = 'stock/history';
    }
    
    const response = await axios.get(`${API_URLS.FCSAPI}/${endpoint}`, {
      params: {
        symbol,
        period,
        access_key: API_KEYS.FCSAPI
      }
    });
    
    if (response.data && response.data.status && response.data.response) {
      const historyData = response.data.response;
      
      // Format data for lightweight-charts
      return historyData.map((candle: any) => ({
        time: new Date(candle.tm).getTime() / 1000,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c)
      })).reverse();
    }
    
    throw new Error('Invalid response format from FCSAPI');
  } catch (error) {
    console.error('Error fetching chart data from FCSAPI:', error);
    throw error;
  }
};

// Helper function to convert timeframe to FCSAPI period
const timeframeToFCSAPIPeriod = (timeframe: string): string => {
  switch (timeframe) {
    case '1m': return '1m';
    case '5m': return '5m';
    case '15m': return '15m';
    case '1h': return '1h';
    case '4h': return '4h';
    case '1d': return '1d';
    default: return '1d';
  }
};
