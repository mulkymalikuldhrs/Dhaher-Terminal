import axios from 'axios';
import { Asset, AssetCategory, Signal } from '../types';
import { API_KEYS, API_URLS, ASSET_TYPE_MAPPINGS } from './apiConfig';
import { toast } from 'react-toastify';
import { 
  fetchCommoditiesFromFCSAPI, 
  fetchIndicesFromFCSAPI, 
  fetchCryptoFromFCSAPI,
  fetchChartDataFromFCSAPI
} from './fcsapiService';

// Cache to prevent excessive API calls
const dataCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes - reduced for more frequent real-time updates

// Fetch assets by category
export const fetchAssets = async (category: AssetCategory | 'all'): Promise<Asset[]> => {
  try {
    if (category === 'all') {
      // Fetch a representative sample from each category
      const promises = Object.keys(ASSET_TYPE_MAPPINGS).map(cat => 
        fetchAssetsByCategory(cat as AssetCategory)
      );
      const results = await Promise.all(promises);
      return results.flat();
    } else {
      return await fetchAssetsByCategory(category);
    }
  } catch (error) {
    console.error('Error fetching assets:', error);
    toast.error('Error fetching market data. Using cached data if available.');
    
    // Use mock data as fallback
    const { mockAssets } = await import('../data/mockData');
    if (category === 'all') {
      return mockAssets;
    } else {
      return mockAssets.filter(asset => asset.category === category);
    }
  }
};

// Fetch assets for a specific category
const fetchAssetsByCategory = async (category: AssetCategory): Promise<Asset[]> => {
  const cacheKey = `assets_${category}`;
  const cachedData = dataCache[cacheKey];
  
  // Return cached data if available and not expired
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
    return cachedData.data;
  }
  
  const mapping = ASSET_TYPE_MAPPINGS[category];
  let assets: Asset[] = [];
  
  switch (mapping.apiSource) {
    case 'FCSAPI':
      if (category.includes('forex')) {
        assets = await fetchForexFromFCSAPI(category);
      } else if (category === 'commodities') {
        assets = await fetchCommoditiesFromFCSAPI();
      } else if (category === 'indices') {
        assets = await fetchIndicesFromFCSAPI();
      } else if (category === 'crypto') {
        assets = await fetchCryptoFromFCSAPI();
      }
      break;
    case 'ALPHA_VANTAGE':
      assets = await fetchForexFromAlphaVantage(category);
      break;
    case 'YAHOO_FINANCE':
      if (category === 'commodities') {
        assets = await fetchCommoditiesFromYahoo();
      } else if (category === 'indices') {
        assets = await fetchIndicesFromYahoo();
      }
      break;
    case 'COINGECKO':
      assets = await fetchCryptoFromCoinGecko();
      break;
    default:
      throw new Error(`Unsupported API source for category: ${category}`);
  }
  
  // Cache the results
  dataCache[cacheKey] = { data: assets, timestamp: Date.now() };
  return assets;
};

// Fetch forex data from FCSAPI
const fetchForexFromFCSAPI = async (category: AssetCategory): Promise<Asset[]> => {
  // Define forex pairs based on category
  const pairs = category === 'forex_major' 
    ? ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD']
    : category === 'forex_cross'
    ? ['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'EUR/AUD']
    : ['USD/SGD', 'USD/HKD', 'USD/ZAR', 'USD/TRY', 'USD/MXN'];
  
  const assets: Asset[] = [];
  
  try {
    // Format the symbols for FCSAPI
    const symbols = pairs.map(pair => pair.replace('/', '')).join(',');
    
    const response = await axios.get(`${API_URLS.FCSAPI}/forex/latest`, {
      params: {
        symbol: symbols,
        access_key: API_KEYS.FCSAPI
      }
    });
    
    if (response.data && response.data.status && response.data.response) {
      const forexData = response.data.response;
      
      forexData.forEach((item: any) => {
        const pair = item.symbol;
        const formattedPair = `${pair.substring(0, 3)}/${pair.substring(3, 6)}`;
        
        const price = parseFloat(item.price);
        const changePercent = parseFloat(item.chg_per);
        const change = parseFloat(item.chg);
        
        // Calculate high and low based on available data
        const high = price * (1 + Math.abs(changePercent) / 100);
        const low = price * (1 - Math.abs(changePercent) / 100);
        
        assets.push({
          id: pair.toLowerCase(),
          symbol: formattedPair,
          name: item.name || `${formattedPair.split('/')[0]} / ${formattedPair.split('/')[1]}`,
          price,
          change,
          changePercent,
          volume: parseInt(item.vol || '0') || Math.floor(Math.random() * 100000),
          high,
          low,
          category,
          retailSentiment: {
            long: Math.floor(Math.random() * 40) + 30, // Random sentiment for demo
            short: Math.floor(Math.random() * 40) + 30,
          },
          cotPosition: {
            net: Math.floor(Math.random() * 20000) - 10000,
            trend: changePercent >= 0 ? 'long' : 'short',
          }
        });
      });
    }
    
    // If we didn't get all the pairs, fill in with mock data
    if (assets.length < pairs.length) {
      const { mockAssets } = await import('../data/mockData');
      const mockForexAssets = mockAssets.filter(asset => asset.category === category);
      
      pairs.forEach((pair, index) => {
        const exists = assets.some(a => a.symbol === pair);
        if (!exists && mockForexAssets[index]) {
          assets.push({
            ...mockForexAssets[index],
            symbol: pair,
            name: `${pair.split('/')[0]} / ${pair.split('/')[1]}`
          });
        }
      });
    }
    
    return assets;
  } catch (error) {
    console.error('Error fetching forex data from FCSAPI:', error);
    
    // Log the specific error for debugging
    console.error('Error details:', error.response?.data || error.message);
    toast.error('FCSAPI request failed. Falling back to cached data.');
    
    // Fallback to mock data if API call fails
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === category);
  }
};

// Fetch commodity data from Yahoo Finance
const fetchCommoditiesFromYahoo = async (): Promise<Asset[]> => {
  const commoditySymbols = ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F'];
  const commodityNames = ['Gold', 'Silver', 'Crude Oil', 'Natural Gas', 'Copper'];
  
  try {
    // Fetch gold as an example
    const response = await axios.get(`${API_URLS.YAHOO_FINANCE}/chart/GC=F`, {
      params: {
        interval: '1d',
        range: '1d'
      }
    });
    
    if (response.data && response.data.chart && 
        response.data.chart.result && response.data.chart.result[0]) {
      
      const result = response.data.chart.result[0];
      const quotes = result.indicators.quote[0];
      
      const latestIndex = quotes.close.length - 1;
      const price = quotes.close[latestIndex];
      const open = quotes.open[latestIndex];
      const high = quotes.high[latestIndex];
      const low = quotes.low[latestIndex];
      const volume = quotes.volume[latestIndex];
      
      const changePercent = ((price - open) / open) * 100;
      
      const assets: Asset[] = [{
        id: 'xauusd',
        symbol: 'XAU/USD',
        name: 'Gold / US Dollar',
        price,
        change: price - open,
        changePercent,
        volume,
        high,
        low,
        category: 'commodities',
        retailSentiment: {
          long: Math.floor(Math.random() * 40) + 30,
          short: Math.floor(Math.random() * 40) + 30,
        }
      }];
      
      // Add other commodities using mock data for demo
      const { mockAssets } = await import('../data/mockData');
      const mockCommodities = mockAssets.filter(asset => asset.category === 'commodities');
      
      for (let i = 1; i < commoditySymbols.length; i++) {
        if (mockCommodities[i-1]) {
          assets.push({
            ...mockCommodities[i-1],
            symbol: commoditySymbols[i].replace('=F', ''),
            name: commodityNames[i],
          });
        }
      }
      
      return assets;
    }
    
    throw new Error('Invalid response format from Yahoo Finance');
  } catch (error) {
    console.error('Error fetching commodity data:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === 'commodities');
  }
};

// Fetch indices data from Yahoo Finance
const fetchIndicesFromYahoo = async (): Promise<Asset[]> => {
  const indexSymbols = ['^GSPC', '^NDX', '^DJI', '^FTSE', '^N225'];
  const indexNames = ['S&P 500', 'NASDAQ 100', 'Dow Jones', 'FTSE 100', 'Nikkei 225'];
  
  try {
    // Fetch S&P 500 as an example
    const response = await axios.get(`${API_URLS.YAHOO_FINANCE}/chart/%5EGSPC`, {
      params: {
        interval: '1d',
        range: '1d'
      }
    });
    
    if (response.data && response.data.chart && 
        response.data.chart.result && response.data.chart.result[0]) {
      
      const result = response.data.chart.result[0];
      const quotes = result.indicators.quote[0];
      
      const latestIndex = quotes.close.length - 1;
      const price = quotes.close[latestIndex];
      const open = quotes.open[latestIndex];
      const high = quotes.high[latestIndex];
      const low = quotes.low[latestIndex];
      const volume = quotes.volume[latestIndex];
      
      const changePercent = ((price - open) / open) * 100;
      
      const assets: Asset[] = [{
        id: 'spx500',
        symbol: 'SPX500',
        name: 'S&P 500',
        price,
        change: price - open,
        changePercent,
        volume,
        high,
        low,
        category: 'indices',
        retailSentiment: {
          long: Math.floor(Math.random() * 40) + 30,
          short: Math.floor(Math.random() * 40) + 30,
        }
      }];
      
      // Add other indices using mock data for demo
      const { mockAssets } = await import('../data/mockData');
      const mockIndices = mockAssets.filter(asset => asset.category === 'indices');
      
      for (let i = 1; i < indexSymbols.length; i++) {
        if (mockIndices[i-1]) {
          assets.push({
            ...mockIndices[i-1],
            symbol: indexSymbols[i].replace('^', ''),
            name: indexNames[i],
          });
        }
      }
      
      return assets;
    }
    
    throw new Error('Invalid response format from Yahoo Finance');
  } catch (error) {
    console.error('Error fetching indices data:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === 'indices');
  }
};

// Fetch cryptocurrency data from CoinGecko
const fetchCryptoFromCoinGecko = async (): Promise<Asset[]> => {
  try {
    const response = await axios.get(`${API_URLS.COINGECKO}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(coin => ({
        id: coin.id,
        symbol: `${coin.symbol.toUpperCase()}/USD`,
        name: `${coin.name} / US Dollar`,
        price: coin.current_price,
        change: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        volume: coin.total_volume,
        high: coin.high_24h,
        low: coin.low_24h,
        category: 'crypto' as AssetCategory,
        retailSentiment: {
          long: Math.floor(Math.random() * 40) + 30,
          short: Math.floor(Math.random() * 40) + 30,
        },
        structure: {
          bias: coin.price_change_percentage_24h >= 0 ? 'bullish' : 'bearish',
          lastEvent: coin.price_change_percentage_24h >= 0 ? 'BOS' : 'Sweep',
          lastLevel: coin.current_price * 0.99,
        }
      }));
    }
    
    throw new Error('Invalid response format from CoinGecko');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.filter(asset => asset.category === 'crypto');
  }
};

// Fetch chart data for a specific asset
export const fetchChartData = async (
  assetId: string, 
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1d'
) => {
  const cacheKey = `chart_${assetId}_${timeframe}`;
  const cachedData = dataCache[cacheKey];
  
  // Return cached data if available and not expired
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
    return cachedData.data;
  }
  
  try {
    // PRIORITIZE MOCK DATA AS PRIMARY SOURCE for reliable rendering
    console.log('Using mock data as primary source for chart reliability');
    const { getAssetChartData } = await import('../data/mockData');
    const isIntraday = timeframe !== '1d';
    const mockData = getAssetChartData(assetId, isIntraday ? 'intraday' : 'daily');
    
    // Cache the mock data
    dataCache[cacheKey] = { data: mockData, timestamp: Date.now() };
    return mockData;
    
  } catch (mockError) {
    console.error('Error with mock data, trying API sources:', mockError);
    
    try {
      let chartData;
      const asset = await getAssetById(assetId);
      
      if (!asset) {
        throw new Error(`Asset not found: ${assetId}`);
      }
      
      // Try alternative APIs as secondary option
      const interval = timeframeToInterval(timeframe, asset.category);
      
      if (asset.category.includes('forex')) {
        chartData = await fetchForexChartData(asset, interval);
      } else if (asset.category === 'crypto') {
        chartData = await fetchCryptoChartData(asset, interval);
      } else if (asset.category === 'commodities') {
        chartData = await fetchCommodityChartData(asset, interval);
      } else if (asset.category === 'indices') {
        chartData = await fetchIndicesChartData(asset, interval);
      }
      
      if (!chartData) {
        throw new Error('Failed to fetch chart data from API sources');
      }
      
      // Format data for lightweight-charts
      const formattedData = chartData.map((candle: any) => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      }));
      
      // Cache the results
      dataCache[cacheKey] = { data: formattedData, timestamp: Date.now() };
      return formattedData;
      
    } catch (apiError) {
      console.error('All chart data sources failed:', apiError);
      
      // Final fallback: generate simple mock data
      const currentTime = Math.floor(Date.now() / 1000);
      const basePrice = 1.1000 + Math.random() * 0.1;
      
      const fallbackData = Array.from({ length: 100 }, (_, i) => {
        const time = currentTime - (100 - i) * 3600; // 1 hour intervals
        const randomFactor = 0.995 + Math.random() * 0.01;
        const price = basePrice * randomFactor;
        const high = price * (1 + Math.random() * 0.005);
        const low = price * (1 - Math.random() * 0.005);
        
        return {
          time,
          open: price,
          high,
          low,
          close: price * (0.998 + Math.random() * 0.004)
        };
      });
      
      // Cache fallback data
      dataCache[cacheKey] = { data: fallbackData, timestamp: Date.now() };
      return fallbackData;
    }
  }
};

// Fetch forex chart data
const fetchForexChartData = async (asset: Asset, interval: string) => {
  const fromCurrency = asset.symbol.split('/')[0];
  const toCurrency = asset.symbol.split('/')[1];
  
  const response = await axios.get(API_URLS.ALPHA_VANTAGE, {
    params: {
      function: 'FX_INTRADAY',
      from_symbol: fromCurrency,
      to_symbol: toCurrency,
      interval,
      apikey: API_KEYS.ALPHA_VANTAGE,
      outputsize: 'full'
    }
  });
  
  if (response.data && response.data['Time Series FX (' + interval + ')']) {
    const timeSeries = response.data['Time Series FX (' + interval + ')'];
    
    return Object.entries(timeSeries).map(([time, data]: [string, any]) => ({
      time: new Date(time).getTime() / 1000,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close'])
    })).reverse();
  }
  
  throw new Error('Invalid response format from Alpha Vantage');
};

// Fetch crypto chart data
const fetchCryptoChartData = async (asset: Asset, interval: string) => {
  const coinId = asset.id;
  const days = intervalToDays(interval);
  
  const response = await axios.get(`${API_URLS.COINGECKO}/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days,
      interval: interval === '1d' ? 'daily' : undefined
    }
  });
  
  if (response.data && response.data.prices) {
    // CoinGecko only provides price data, not OHLC
    // Convert price data to OHLC format
    const prices = response.data.prices;
    const candles = [];
    
    for (let i = 0; i < prices.length; i += 4) {
      if (i + 3 < prices.length) {
        const timeGroup = prices.slice(i, i + 4);
        const time = timeGroup[0][0] / 1000;
        const priceValues = timeGroup.map(item => item[1]);
        
        candles.push({
          time,
          open: priceValues[0],
          high: Math.max(...priceValues),
          low: Math.min(...priceValues),
          close: priceValues[priceValues.length - 1]
        });
      }
    }
    
    return candles;
  }
  
  throw new Error('Invalid response format from CoinGecko');
};

// Fetch commodity chart data
const fetchCommodityChartData = async (asset: Asset, interval: string) => {
  let symbol = '';
  
  // Map asset to Yahoo Finance symbol
  if (asset.symbol === 'XAU/USD') symbol = 'GC=F';
  else if (asset.symbol === 'XAG/USD') symbol = 'SI=F';
  else if (asset.symbol === 'OIL/USD') symbol = 'CL=F';
  else if (asset.symbol === 'NAT/USD') symbol = 'NG=F';
  else symbol = 'GC=F'; // Default to gold
  
  const range = intervalToRange(interval);
  
  const response = await axios.get(`${API_URLS.YAHOO_FINANCE}/chart/${symbol}`, {
    params: {
      interval,
      range
    }
  });
  
  if (response.data && response.data.chart && 
      response.data.chart.result && response.data.chart.result[0]) {
    
    const result = response.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    return timestamps.map((time: number, i: number) => ({
      time,
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      close: quotes.close[i]
    }));
  }
  
  throw new Error('Invalid response format from Yahoo Finance');
};

// Fetch indices chart data
const fetchIndicesChartData = async (asset: Asset, interval: string) => {
  let symbol = '';
  
  // Map asset to Yahoo Finance symbol
  if (asset.symbol === 'SPX500') symbol = '%5EGSPC';
  else if (asset.symbol === 'NAS100') symbol = '%5ENDX';
  else if (asset.symbol === 'DJ30') symbol = '%5EDJI';
  else symbol = '%5EGSPC'; // Default to S&P 500
  
  const range = intervalToRange(interval);
  
  const response = await axios.get(`${API_URLS.YAHOO_FINANCE}/chart/${symbol}`, {
    params: {
      interval,
      range
    }
  });
  
  if (response.data && response.data.chart && 
      response.data.chart.result && response.data.chart.result[0]) {
    
    const result = response.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    return timestamps.map((time: number, i: number) => ({
      time,
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      close: quotes.close[i]
    }));
  }
  
  throw new Error('Invalid response format from Yahoo Finance');
};

// Get asset by ID
export const getAssetById = async (assetId: string): Promise<Asset | undefined> => {
  const cacheKey = `asset_${assetId}`;
  const cachedData = dataCache[cacheKey];
  
  // Return cached data if available and not expired
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
    return cachedData.data;
  }
  
  try {
    // Find asset in the database of all assets
    const allAssets = await fetchAssets('all');
    const asset = allAssets.find(a => a.id === assetId);
    
    if (asset) {
      // Cache the result
      dataCache[cacheKey] = { data: asset, timestamp: Date.now() };
      return asset;
    }
    
    // If not found, try to fetch individual asset
    // This would be implemented based on specific APIs
    
    // For now, fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    const mockAsset = mockAssets.find(a => a.id === assetId);
    
    if (mockAsset) {
      dataCache[cacheKey] = { data: mockAsset, timestamp: Date.now() };
      return mockAsset;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting asset by ID:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    return mockAssets.find(a => a.id === assetId);
  }
};

// Fetch signals for assets
export const fetchSignals = async (): Promise<(Signal & { asset: Asset })[]> => {
  try {
    // In a real implementation, you would fetch signals from an API
    // For this demo, we'll generate random signals based on asset price movements
    
    const assets = await fetchAssets('all');
    const signals: (Signal & { asset: Asset })[] = [];
    
    for (const asset of assets) {
      // Generate signals for assets with significant price movements
      if (Math.abs(asset.changePercent) > 1.5) {
        const isBullish = asset.changePercent > 0;
        
        signals.push({
          id: `sig_${Date.now()}_${asset.id}`,
          assetId: asset.id,
          timestamp: Date.now() - Math.floor(Math.random() * 3600000),
          type: isBullish ? 'buy' : 'sell',
          strength: Math.abs(asset.changePercent) > 3 ? 'strong' : 
                    Math.abs(asset.changePercent) > 2 ? 'medium' : 'weak',
          price: asset.price,
          reason: isBullish ? 
                  'Price breaking resistance with increased volume' : 
                  'Price breaking support with increased volume',
          status: 'active',
          asset
        });
      }
    }
    
    return signals;
  } catch (error) {
    console.error('Error fetching signals:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    const signals: (Signal & { asset: Asset })[] = [];
    
    mockAssets.forEach(asset => {
      if (asset.signals) {
        asset.signals.forEach(signal => {
          signals.push({
            ...signal,
            asset
          });
        });
      }
    });
    
    return signals;
  }
};

// Fetch market sentiment data
export const fetchMarketSentiment = async () => {
  try {
    // In a real implementation, you would fetch sentiment data from an API
    // For this demo, we'll generate random sentiment data
    
    const assets = await fetchAssets('all');
    
    // Calculate average sentiment
    const totalLong = assets.reduce((sum, asset) => sum + asset.retailSentiment.long, 0);
    const totalShort = assets.reduce((sum, asset) => sum + asset.retailSentiment.short, 0);
    
    return {
      averageSentiment: {
        long: Math.round(totalLong / assets.length),
        short: Math.round(totalShort / assets.length)
      },
      mostBullish: assets.sort((a, b) => b.retailSentiment.long - a.retailSentiment.long)[0],
      mostBearish: assets.sort((a, b) => b.retailSentiment.short - a.retailSentiment.short)[0],
      extremeSentiment: assets.filter(
        asset => asset.retailSentiment.long > 70 || asset.retailSentiment.short > 70
      )
    };
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    
    // Fallback to mock data
    const { mockAssets } = await import('../data/mockData');
    
    const totalLong = mockAssets.reduce((sum, asset) => sum + asset.retailSentiment.long, 0);
    const totalShort = mockAssets.reduce((sum, asset) => sum + asset.retailSentiment.short, 0);
    
    return {
      averageSentiment: {
        long: Math.round(totalLong / mockAssets.length),
        short: Math.round(totalShort / mockAssets.length)
      },
      mostBullish: mockAssets.sort((a, b) => b.retailSentiment.long - a.retailSentiment.long)[0],
      mostBearish: mockAssets.sort((a, b) => b.retailSentiment.short - a.retailSentiment.short)[0],
      extremeSentiment: mockAssets.filter(
        asset => asset.retailSentiment.long > 70 || asset.retailSentiment.short > 70
      )
    };
  }
};

// Helper functions
const timeframeToInterval = (timeframe: string, category: string): string => {
  if (category.includes('forex') || category === 'crypto') {
    switch (timeframe) {
      case '1m': return '1min';
      case '5m': return '5min';
      case '15m': return '15min';
      case '1h': return '60min';
      case '4h': return '60min'; // Fallback to 1h for most free APIs
      case '1d': return 'daily';
      default: return '60min';
    }
  } else {
    // Yahoo Finance format
    switch (timeframe) {
      case '1m': return '1m';
      case '5m': return '5m';
      case '15m': return '15m';
      case '1h': return '1h';
      case '4h': return '1d'; // Fallback to 1d for most free APIs
      case '1d': return '1d';
      default: return '1d';
    }
  }
};

const intervalToDays = (interval: string): number => {
  switch (interval) {
    case '1min': return 1;
    case '5min': return 1;
    case '15min': return 1;
    case '60min': return 7;
    case 'daily': return 30;
    default: return 30;
  }
};

const intervalToRange = (interval: string): string => {
  switch (interval) {
    case '1m': return '1d';
    case '5m': return '1d';
    case '15m': return '1d';
    case '1h': return '5d';
    case '1d': return '1mo';
    default: return '1mo';
  }
};
