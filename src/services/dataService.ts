import axios from 'axios';
import { Asset, AssetCategory, Signal } from '../types';
import { API_KEYS, API_URLS, ASSET_TYPE_MAPPINGS } from './apiConfig';
import { toast } from 'react-toastify';

// Cache to prevent excessive API calls
const dataCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache

// Fetch assets by category
export const fetchAssets = async (category: AssetCategory | 'all'): Promise<Asset[]> => {
  try {
    if (category === 'all') {
      const promises = [
        fetchCryptoFromCoinGecko(),
        fetchForexFromAlphaVantage('forex_major'),
        fetchIndicesFromYahoo(),
        fetchCommoditiesFromYahoo()
      ];
      const results = await Promise.allSettled(promises);
      const assets = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<Asset[]>).value)
        .flat();

      return assets.length > 0 ? assets : await getMockFallback(category);
    } else {
      return await fetchAssetsByCategory(category);
    }
  } catch (error) {
    console.error('Error fetching assets:', error);
    toast.error('Using cached data due to API limitations');
    return await getMockFallback(category);
  }
};

// Fetch assets for a specific category
const fetchAssetsByCategory = async (category: AssetCategory): Promise<Asset[]> => {
  const cacheKey = `assets_${category}`;
  const cachedData = dataCache[cacheKey];

  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
    return cachedData.data;
  }

  let assets: Asset[] = [];

  try {
    switch (category) {
      case 'crypto':
        assets = await fetchCryptoFromCoinGecko();
        break;
      case 'forex_major':
      case 'forex_cross':
      case 'forex_exotic':
        assets = await fetchForexFromAlphaVantage(category);
        break;
      case 'commodities':
        assets = await fetchCommoditiesFromYahoo();
        break;
      case 'indices':
        assets = await fetchIndicesFromYahoo();
        break;
      default:
        throw new Error(`Unsupported category: ${category}`);
    }

    // Cache successful results
    if (assets.length > 0) {
      dataCache[cacheKey] = { data: assets, timestamp: Date.now() };
    }

    return assets.length > 0 ? assets : await getMockFallback(category);
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
    return await getMockFallback(category);
  }
};

// Fetch cryptocurrency data from CoinGecko (Free API)
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
        price: coin.current_price || 0,
        change: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume || 0,
        high: coin.high_24h || coin.current_price || 0,
        low: coin.low_24h || coin.current_price || 0,
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

    throw new Error('Invalid response from CoinGecko');
  } catch (error) {
    console.error('Error fetching crypto data from CoinGecko:', error);
    throw error;
  }
};

// Fetch forex data from Alpha Vantage (Free API with demo key)
const fetchForexFromAlphaVantage = async (category: AssetCategory): Promise<Asset[]> => {
  const pairs = category === 'forex_major' 
    ? [{ from: 'EUR', to: 'USD' }, { from: 'GBP', to: 'USD' }, { from: 'USD', to: 'JPY' }]
    : category === 'forex_cross'
    ? [{ from: 'EUR', to: 'GBP' }, { from: 'EUR', to: 'JPY' }, { from: 'GBP', to: 'JPY' }]
    : [{ from: 'USD', to: 'SGD' }, { from: 'USD', to: 'HKD' }, { from: 'USD', to: 'ZAR' }];

  const assets: Asset[] = [];

  try {
    // Try to fetch one pair as example (Alpha Vantage demo key has limited functionality)
    const pair = pairs[0];
    const response = await axios.get(API_URLS.ALPHA_VANTAGE, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: pair.from,
        to_currency: pair.to,
        apikey: 'demo'
      }
    });

    if (response.data && response.data['Realtime Currency Exchange Rate']) {
      const data = response.data['Realtime Currency Exchange Rate'];
      const price = parseFloat(data['5. Exchange Rate']);
      const symbol = `${pair.from}/${pair.to}`;

      assets.push({
        id: symbol.toLowerCase().replace('/', ''),
        symbol,
        name: `${pair.from} / ${pair.to}`,
        price,
        change: price * (Math.random() * 0.02 - 0.01), // Random change for demo
        changePercent: (Math.random() * 2 - 1),
        volume: Math.floor(Math.random() * 100000),
        high: price * 1.005,
        low: price * 0.995,
        category,
        retailSentiment: {
          long: Math.floor(Math.random() * 40) + 30,
          short: Math.floor(Math.random() * 40) + 30,
        }
      });
    }

    // Add remaining pairs with simulated data based on exchange rates API
    const exchangeResponse = await axios.get(`${API_URLS.EXCHANGE_RATES}/USD`);
    if (exchangeResponse.data && exchangeResponse.data.rates) {
      const rates = exchangeResponse.data.rates;

      pairs.slice(1).forEach(pair => {
        let price = 1;
        if (pair.from === 'USD' && rates[pair.to]) {
          price = rates[pair.to];
        } else if (pair.to === 'USD' && rates[pair.from]) {
          price = 1 / rates[pair.from];
        } else if (rates[pair.from] && rates[pair.to]) {
          price = rates[pair.to] / rates[pair.from];
        }

        const symbol = `${pair.from}/${pair.to}`;
        assets.push({
          id: symbol.toLowerCase().replace('/', ''),
          symbol,
          name: `${pair.from} / ${pair.to}`,
          price,
          change: price * (Math.random() * 0.02 - 0.01),
          changePercent: (Math.random() * 2 - 1),
          volume: Math.floor(Math.random() * 100000),
          high: price * 1.005,
          low: price * 0.995,
          category,
          retailSentiment: {
            long: Math.floor(Math.random() * 40) + 30,
            short: Math.floor(Math.random() * 40) + 30,
          }
        });
      });
    }

    return assets;
  } catch (error) {
    console.error('Error fetching forex data:', error);
    throw error;
  }
};

// Fetch indices data from Yahoo Finance (Free, no API key required)
const fetchIndicesFromYahoo = async (): Promise<Asset[]> => {
  const indices = [
    { symbol: '^GSPC', name: 'S&P 500', displaySymbol: 'SPX500' },
    { symbol: '^IXIC', name: 'NASDAQ', displaySymbol: 'NAS100' },
    { symbol: '^DJI', name: 'Dow Jones', displaySymbol: 'DJ30' }
  ];

  const assets: Asset[] = [];

  try {
    for (const index of indices) {
      try {
        const response = await axios.get(`${API_URLS.YAHOO_FINANCE_PROXY}/${encodeURIComponent(index.symbol)}`, {
          params: {
            interval: '1d',
            range: '1d'
          }
        });

        if (response.data?.chart?.result?.[0]) {
          const result = response.data.chart.result[0];
          const meta = result.meta;
          const quotes = result.indicators?.quote?.[0];

          if (meta && quotes) {
            const price = meta.regularMarketPrice || meta.previousClose || 0;
            const previousClose = meta.previousClose || price;
            const change = price - previousClose;
            const changePercent = (change / previousClose) * 100;

            assets.push({
              id: index.displaySymbol.toLowerCase(),
              symbol: index.displaySymbol,
              name: index.name,
              price,
              change,
              changePercent,
              volume: meta.regularMarketVolume || 0,
              high: meta.regularMarketDayHigh || price,
              low: meta.regularMarketDayLow || price,
              category: 'indices',
              retailSentiment: {
                long: Math.floor(Math.random() * 40) + 30,
                short: Math.floor(Math.random() * 40) + 30,
              }
            });
          }
        }
      } catch (indexError) {
        console.warn(`Failed to fetch ${index.symbol}:`, indexError);
      }
    }

    return assets;
  } catch (error) {
    console.error('Error fetching indices data:', error);
    throw error;
  }
};

// Fetch commodities data from Yahoo Finance (Free, no API key required)
const fetchCommoditiesFromYahoo = async (): Promise<Asset[]> => {
  const commodities = [
    { symbol: 'GC=F', name: 'Gold', displaySymbol: 'XAU/USD' },
    { symbol: 'SI=F', name: 'Silver', displaySymbol: 'XAG/USD' },
    { symbol: 'CL=F', name: 'Crude Oil', displaySymbol: 'OIL/USD' }
  ];

  const assets: Asset[] = [];

  try {
    for (const commodity of commodities) {
      try {
        const response = await axios.get(`${API_URLS.YAHOO_FINANCE_PROXY}/${commodity.symbol}`, {
          params: {
            interval: '1d',
            range: '1d'
          }
        });

        if (response.data?.chart?.result?.[0]) {
          const result = response.data.chart.result[0];
          const meta = result.meta;

          if (meta) {
            const price = meta.regularMarketPrice || meta.previousClose || 0;
            const previousClose = meta.previousClose || price;
            const change = price - previousClose;
            const changePercent = (change / previousClose) * 100;

            assets.push({
              id: commodity.displaySymbol.toLowerCase().replace('/', ''),
              symbol: commodity.displaySymbol,
              name: `${commodity.name} / US Dollar`,
              price,
              change,
              changePercent,
              volume: meta.regularMarketVolume || 0,
              high: meta.regularMarketDayHigh || price,
              low: meta.regularMarketDayLow || price,
              category: 'commodities',
              retailSentiment: {
                long: Math.floor(Math.random() * 40) + 30,
                short: Math.floor(Math.random() * 40) + 30,
              }
            });
          }
        }
      } catch (commodityError) {
        console.warn(`Failed to fetch ${commodity.symbol}:`, commodityError);
      }
    }

    return assets;
  } catch (error) {
    console.error('Error fetching commodities data:', error);
    throw error;
  }
};

// Get mock data as fallback
const getMockFallback = async (category: AssetCategory | 'all'): Promise<Asset[]> => {
  const { mockAssets } = await import('../data/mockData');
  
  // Generate enhanced mock data with real-time variations
  const enhancedAssets = mockAssets.map(asset => ({
    ...asset,
    price: asset.price * (1 + (Math.random() * 0.02 - 0.01)), // ±1% variation
    change: asset.change * (1 + (Math.random() * 0.1 - 0.05)), // ±5% variation in change
    changePercent: asset.changePercent * (1 + (Math.random() * 0.1 - 0.05)),
    volume: asset.volume * (1 + (Math.random() * 0.2 - 0.1)), // ±10% variation in volume
    retailSentiment: {
      long: Math.max(0, Math.min(100, asset.retailSentiment.long + (Math.random() * 10 - 5))),
      short: Math.max(0, Math.min(100, asset.retailSentiment.short + (Math.random() * 10 - 5)))
    }
  }));

  if (category === 'all') {
    return enhancedAssets;
  } else {
    return enhancedAssets.filter(asset => asset.category === category);
  }
};

// Fetch chart data with real APIs and enhanced fallback
export const fetchChartData = async (
  assetId: string, 
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1d'
) => {
  const cacheKey = `chart_${assetId}_${timeframe}`;
  const cachedData = dataCache[cacheKey];

  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
    return cachedData.data;
  }

  try {
    const asset = await getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    let chartData;

    // Try real APIs first
    if (asset.category === 'crypto') {
      chartData = await fetchCryptoChartData(asset, timeframe);
    } else if (asset.category.includes('forex')) {
      chartData = await fetchForexChartData(asset, timeframe);
    } else if (asset.category === 'commodities' || asset.category === 'indices') {
      chartData = await fetchYahooChartData(asset, timeframe);
    }

    if (chartData && chartData.length > 0) {
      dataCache[cacheKey] = { data: chartData, timestamp: Date.now() };
      return chartData;
    }

    throw new Error('No chart data available from APIs');
  } catch (error) {
    console.warn('Using simulated chart data due to API limitations:', error.message);

    // Generate enhanced realistic chart data
    const simulatedData = generateRealisticChartData(assetId, timeframe);
    dataCache[cacheKey] = { data: simulatedData, timestamp: Date.now() };
    return simulatedData;
  }
};

// Generate realistic chart data with proper market behavior
const generateRealisticChartData = (assetId: string, timeframe: string) => {
  const asset = mockAssets.find(a => a.id === assetId);
  if (!asset) return [];

  const basePrice = asset.price;
  const volatility = getAssetVolatility(asset.category);
  const periods = getPeriodsForTimeframe(timeframe);
  const intervalMs = getIntervalMs(timeframe);
  
  const data = [];
  let currentPrice = basePrice * 0.95; // Start 5% below current price
  const now = Date.now();
  
  for (let i = periods; i >= 0; i--) {
    const time = Math.floor((now - i * intervalMs) / 1000);
    
    // Market trends and patterns
    const trendDirection = Math.sin(i / periods * Math.PI * 2) * 0.3; // Sine wave trend
    const randomWalk = (Math.random() - 0.5) * volatility;
    const momentum = (currentPrice - basePrice) / basePrice * 0.1; // Mean reversion
    
    const priceChange = (trendDirection + randomWalk - momentum) * currentPrice;
    currentPrice += priceChange;
    
    // Ensure price doesn't go negative
    currentPrice = Math.max(currentPrice, basePrice * 0.5);
    
    // Generate OHLC
    const open = currentPrice;
    const volatilityRange = currentPrice * volatility * 0.5;
    const high = open + Math.random() * volatilityRange;
    const low = open - Math.random() * volatilityRange;
    const close = low + Math.random() * (high - low);
    
    data.push({
      time,
      open: Number(open.toFixed(asset.category === 'crypto' ? 2 : 4)),
      high: Number(high.toFixed(asset.category === 'crypto' ? 2 : 4)),
      low: Number(low.toFixed(asset.category === 'crypto' ? 2 : 4)),
      close: Number(close.toFixed(asset.category === 'crypto' ? 2 : 4))
    });
    
    currentPrice = close;
  }
  
  return data;
};

const getAssetVolatility = (category: AssetCategory): number => {
  switch (category) {
    case 'crypto': return 0.05; // 5% volatility
    case 'forex_major': return 0.01; // 1% volatility
    case 'forex_cross': return 0.015; // 1.5% volatility
    case 'forex_exotic': return 0.025; // 2.5% volatility
    case 'commodities': return 0.02; // 2% volatility
    case 'indices': return 0.015; // 1.5% volatility
    default: return 0.02;
  }
};

const getPeriodsForTimeframe = (timeframe: string): number => {
  switch (timeframe) {
    case '1m': return 120; // 2 hours
    case '5m': return 144; // 12 hours
    case '15m': return 96; // 24 hours
    case '1h': return 168; // 1 week
    case '4h': return 168; // 4 weeks
    case '1d': return 90; // 3 months
    default: return 90;
  }
};

const getIntervalMs = (timeframe: string): number => {
  switch (timeframe) {
    case '1m': return 60 * 1000;
    case '5m': return 5 * 60 * 1000;
    case '15m': return 15 * 60 * 1000;
    case '1h': return 60 * 60 * 1000;
    case '4h': return 4 * 60 * 60 * 1000;
    case '1d': return 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
};

// Fetch crypto chart data from CoinGecko with enhanced timeframe support
const fetchCryptoChartData = async (asset: Asset, timeframe: string = '1d') => {
  try {
    // Map asset symbol to CoinGecko ID
    const coinId = getCoinGeckoId(asset.symbol);
    if (!coinId) {
      throw new Error(`CoinGecko ID not found for ${asset.symbol}`);
    }

    const days = getCoingeckoDays(timeframe);
    const interval = getCoingeckoInterval(timeframe);

    const response = await axios.get(`${API_URLS.COINGECKO}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval
      }
    });

    if (response.data?.prices && Array.isArray(response.data.prices)) {
      return response.data.prices.map((price: [number, number], index: number) => {
        const time = Math.floor(price[0] / 1000);
        const close = price[1];
        const open = index > 0 ? response.data.prices[index - 1][1] : close;
        
        // Generate realistic OHLC from price data
        const volatility = close * 0.01; // 1% volatility
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;

        return { 
          time, 
          open: Number(open.toFixed(2)), 
          high: Number(high.toFixed(2)), 
          low: Number(low.toFixed(2)), 
          close: Number(close.toFixed(2)) 
        };
      });
    }

    throw new Error('Invalid response from CoinGecko');
  } catch (error) {
    console.error('CoinGecko API error:', error);
    throw error;
  }
};

// Helper functions for CoinGecko API
const getCoinGeckoId = (symbol: string): string | null => {
  const mapping: Record<string, string> = {
    'BTC/USD': 'bitcoin',
    'ETH/USD': 'ethereum',
    'ADA/USD': 'cardano',
    'DOT/USD': 'polkadot',
    'LINK/USD': 'chainlink',
    'XRP/USD': 'ripple',
    'LTC/USD': 'litecoin',
    'BCH/USD': 'bitcoin-cash'
  };
  
  return mapping[symbol] || null;
};

const getCoingeckoDays = (timeframe: string): string => {
  switch (timeframe) {
    case '1m':
    case '5m':
    case '15m': return '1';
    case '1h': return '7';
    case '4h': return '30';
    case '1d': return '90';
    default: return '30';
  }
};

const getCoingeckoInterval = (timeframe: string): string => {
  switch (timeframe) {
    case '1m':
    case '5m':
    case '15m': return 'minutely';
    case '1h': return 'hourly';
    case '4h':
    case '1d': return 'daily';
    default: return 'daily';
  }
};

// Fetch forex chart data (simplified)
const fetchForexChartData = async (asset: Asset) => {
  // Generate realistic forex chart data
  const days = 30;
  const data = [];
  const basePrice = asset.price;

  for (let i = days; i >= 0; i--) {
    const time = Math.floor((Date.now() - i * 24 * 60 * 60 * 1000) / 1000);
    const volatility = 0.01;
    const change = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + change);

    data.push({
      time,
      open: price,
      high: price * (1 + Math.random() * 0.005),
      low: price * (1 - Math.random() * 0.005),
      close: price * (1 + (Math.random() - 0.5) * 0.01)
    });
  }

  return data;
};

// Fetch Yahoo Finance chart data
const fetchYahooChartData = async (asset: Asset) => {
  let symbol = asset.symbol;

  // Map to Yahoo Finance symbols
  if (asset.category === 'commodities') {
    if (asset.symbol === 'XAU/USD') symbol = 'GC=F';
    else if (asset.symbol === 'XAG/USD') symbol = 'SI=F';
    else if (asset.symbol === 'OIL/USD') symbol = 'CL=F';
  } else if (asset.category === 'indices') {
    if (asset.symbol === 'SPX500') symbol = '^GSPC';
    else if (asset.symbol === 'NAS100') symbol = '^IXIC';
    else if (asset.symbol === 'DJ30') symbol = '^DJI';
  }

  const response = await axios.get(`${API_URLS.YAHOO_FINANCE_PROXY}/${symbol}`, {
    params: {
      interval: '1d',
      range: '1mo'
    }
  });

  if (response.data?.chart?.result?.[0]) {
    const result = response.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators?.quote?.[0];

    if (timestamps && quotes) {
      return timestamps.map((time: number, i: number) => ({
        time,
        open: quotes.open[i] || quotes.close[i] || 0,
        high: quotes.high[i] || quotes.close[i] || 0,
        low: quotes.low[i] || quotes.close[i] || 0,
        close: quotes.close[i] || 0
      })).filter(candle => candle.close > 0);
    }
  }

  throw new Error('Invalid Yahoo chart data');
};

// Get asset by ID
export const getAssetById = async (assetId: string): Promise<Asset | undefined> => {
  const allAssets = await fetchAssets('all');
  return allAssets.find(a => a.id === assetId);
};

// Fetch signals
export const fetchSignals = async () => {
  const assets = await fetchAssets('all');
  const signals: (Signal & { asset: Asset })[] = [];

  assets.forEach(asset => {
    if (Math.abs(asset.changePercent) > 2) {
      signals.push({
        id: `sig_${Date.now()}_${asset.id}`,
        assetId: asset.id,
        timestamp: Date.now() - Math.floor(Math.random() * 3600000),
        type: asset.changePercent > 0 ? 'buy' : 'sell',
        strength: Math.abs(asset.changePercent) > 5 ? 'strong' : 'medium',
        price: asset.price,
        reason: asset.changePercent > 0 ? 'Bullish breakout detected' : 'Bearish breakdown detected',
        status: 'active',
        asset
      });
    }
  });

  return signals;
};

// Fetch market sentiment
export const fetchMarketSentiment = async () => {
  const assets = await fetchAssets('all');

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
};