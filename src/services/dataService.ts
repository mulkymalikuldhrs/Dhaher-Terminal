<<<<<<< HEAD
// Enhanced Data Service for Dhaher Terminal Pro v2.0
// Comprehensive market data with advanced features and fallback strategies
=======
// @ts-nocheck
import axios from 'axios';
import { Asset, AssetCategory, Signal } from '../types';
import { API_KEYS, API_URLS, ASSET_TYPE_MAPPINGS } from './apiConfig';
import { toast } from 'react-toastify';
>>>>>>> main

import axios, { AxiosResponse } from 'axios';
import { 
  API_KEYS, 
  API_URLS, 
  ASSET_TYPE_MAPPINGS, 
  RATE_LIMITS, 
  CACHE_CONFIG, 
  ERROR_CONFIG,
  SYMBOL_MAPPINGS 
} from './apiConfig';

// Enhanced types for better type safety
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  timestamp: number;
  source: string;
}

export interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: 'low' | 'medium' | 'high';
  actual?: string;
  forecast?: string;
  previous?: string;
  timestamp: string;
}

export interface SentimentData {
  symbol: string;
  fearGreedIndex?: number;
  socialSentiment?: number;
  institutionalSentiment?: number;
  retailSentiment?: number;
  newsScore?: number;
  overallScore: number;
  timestamp: number;
}

// Enhanced caching system
class DataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Rate limiting system
class RateLimiter {
  private requests = new Map<string, number[]>();

  canMakeRequest(apiSource: string): boolean {
    const limit = RATE_LIMITS[apiSource as keyof typeof RATE_LIMITS];
    if (!limit) return true;

    const now = Date.now();
    const requests = this.requests.get(apiSource) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < limit.window);
    
    if (validRequests.length >= limit.requests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(apiSource, validRequests);
    return true;
  }
}

// Circuit breaker for API reliability
class CircuitBreaker {
  private failures = new Map<string, number>();
  private lastFailureTime = new Map<string, number>();

  canMakeRequest(apiSource: string): boolean {
    const failures = this.failures.get(apiSource) || 0;
    const lastFailure = this.lastFailureTime.get(apiSource) || 0;

    if (failures >= ERROR_CONFIG.CIRCUIT_BREAKER_THRESHOLD) {
      if (Date.now() - lastFailure > ERROR_CONFIG.CIRCUIT_BREAKER_TIMEOUT) {
        this.reset(apiSource);
        return true;
      }
      return false;
    }

    return true;
  }

  recordFailure(apiSource: string): void {
    const failures = this.failures.get(apiSource) || 0;
    this.failures.set(apiSource, failures + 1);
    this.lastFailureTime.set(apiSource, Date.now());
  }

  recordSuccess(apiSource: string): void {
    this.failures.set(apiSource, 0);
  }

  reset(apiSource: string): void {
    this.failures.set(apiSource, 0);
    this.lastFailureTime.delete(apiSource);
  }
}

class EnhancedDataService {
  private cache = new DataCache();
  private rateLimiter = new RateLimiter();
  private circuitBreaker = new CircuitBreaker();
  private retryQueue = new Map<string, number>();

  // Enhanced API request with retry logic and error handling
  private async makeRequest<T>(
    url: string,
    apiSource: string,
    config: any = {}
  ): Promise<T> {
    // Check circuit breaker
    if (!this.circuitBreaker.canMakeRequest(apiSource)) {
      throw new Error(`Circuit breaker open for ${apiSource}`);
    }

    // Check rate limiting
    if (!this.rateLimiter.canMakeRequest(apiSource)) {
      throw new Error(`Rate limit exceeded for ${apiSource}`);
    }

    let lastError: Error;
    let retryCount = 0;

    while (retryCount <= ERROR_CONFIG.MAX_RETRIES) {
      try {
        const response: AxiosResponse<T> = await axios({
          url,
          timeout: 10000,
          ...config
        });

        this.circuitBreaker.recordSuccess(apiSource);
        return response.data;
      } catch (error) {
        lastError = error as Error;
        retryCount++;

        if (retryCount <= ERROR_CONFIG.MAX_RETRIES) {
          const delay = ERROR_CONFIG.RETRY_DELAY * Math.pow(ERROR_CONFIG.BACKOFF_MULTIPLIER, retryCount - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    this.circuitBreaker.recordFailure(apiSource);
    throw lastError!;
  }

  // Get cryptocurrency data with enhanced features
  async getCryptoData(symbols: string[] = ['bitcoin', 'ethereum', 'cardano']): Promise<MarketData[]> {
    const cacheKey = `crypto_${symbols.join('_')}`;
    const cached = this.cache.get<MarketData[]>(cacheKey);
    if (cached) return cached;

    try {
      // Primary: CoinGecko
      const url = `${API_URLS.COINGECKO}/coins/markets?vs_currency=usd&ids=${symbols.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;
      
      const data = await this.makeRequest<any[]>(url, 'COINGECKO');
      
      const marketData: MarketData[] = data.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume || 0,
        high24h: coin.high_24h || coin.current_price,
        low24h: coin.low_24h || coin.current_price,
        marketCap: coin.market_cap,
        timestamp: Date.now(),
        source: 'CoinGecko'
      }));

      this.cache.set(cacheKey, marketData, CACHE_CONFIG.MARKET_DATA_TTL);
      return marketData;

    } catch (error) {
      console.warn('CoinGecko failed, trying Binance fallback:', error);
      
      try {
        // Fallback: Binance
        const url = `${API_URLS.BINANCE}/ticker/24hr`;
        const data = await this.makeRequest<any[]>(url, 'BINANCE');
        
        const binanceData = data
          .filter(ticker => symbols.some(s => ticker.symbol.toLowerCase().includes(s.replace('bitcoin', 'btc').replace('ethereum', 'eth'))))
          .map(ticker => ({
            symbol: ticker.symbol,
            price: parseFloat(ticker.lastPrice),
            change: parseFloat(ticker.priceChange),
            changePercent: parseFloat(ticker.priceChangePercent),
            volume: parseFloat(ticker.volume),
            high24h: parseFloat(ticker.highPrice),
            low24h: parseFloat(ticker.lowPrice),
            timestamp: Date.now(),
            source: 'Binance'
          }));

        this.cache.set(cacheKey, binanceData, CACHE_CONFIG.MARKET_DATA_TTL);
        return binanceData;

      } catch (fallbackError) {
        console.error('All crypto APIs failed:', fallbackError);
        return this.getMockCryptoData(symbols);
      }
    }
  }

  // Get forex data with multiple timeframes
  async getForexData(pairs: string[] = ['EUR/USD', 'GBP/USD', 'USD/JPY']): Promise<MarketData[]> {
    const cacheKey = `forex_${pairs.join('_')}`;
    const cached = this.cache.get<MarketData[]>(cacheKey);
    if (cached) return cached;

    try {
      // Primary: Twelve Data
      const results: MarketData[] = [];
      
             for (const pair of pairs) {
         const symbol = SYMBOL_MAPPINGS.FOREX[pair as keyof typeof SYMBOL_MAPPINGS.FOREX]?.twelve || pair;
        const url = `${API_URLS.TWELVE_DATA}/price?symbol=${symbol}&apikey=${API_KEYS.TWELVE_DATA}`;
        
        try {
          const data = await this.makeRequest<any>(url, 'TWELVE_DATA');
          
          if (data.price) {
            results.push({
              symbol: pair,
              price: parseFloat(data.price),
              change: 0, // Will be calculated from historical data
              changePercent: 0,
              volume: 0,
              high24h: parseFloat(data.price),
              low24h: parseFloat(data.price),
              timestamp: Date.now(),
              source: 'Twelve Data'
            });
          }
        } catch (error) {
          console.warn(`Failed to get ${pair} from Twelve Data:`, error);
        }
      }

      if (results.length > 0) {
        this.cache.set(cacheKey, results, CACHE_CONFIG.MARKET_DATA_TTL);
        return results;
      }

      throw new Error('No data from primary source');

    } catch (error) {
      console.warn('Twelve Data failed, trying Exchange Rates API:', error);
      
      try {
        // Fallback: Exchange Rates API
        const url = `${API_URLS.EXCHANGE_RATES}/USD`;
        const data = await this.makeRequest<any>(url, 'EXCHANGE_RATES');
        
        const forexData: MarketData[] = pairs.map(pair => {
          const [base, quote] = pair.split('/');
          let rate = 1;
          
          if (base === 'USD') {
            rate = data.rates[quote] || 1;
          } else if (quote === 'USD') {
            rate = 1 / (data.rates[base] || 1);
          } else {
            rate = (data.rates[quote] || 1) / (data.rates[base] || 1);
          }

          return {
            symbol: pair,
            price: rate,
            change: 0,
            changePercent: 0,
            volume: 0,
            high24h: rate,
            low24h: rate,
            timestamp: Date.now(),
            source: 'Exchange Rates API'
          };
        });

        this.cache.set(cacheKey, forexData, CACHE_CONFIG.MARKET_DATA_TTL);
        return forexData;

      } catch (fallbackError) {
        console.error('All forex APIs failed:', fallbackError);
        return this.getMockForexData(pairs);
      }
    }
<<<<<<< HEAD
=======

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
>>>>>>> main
  }

  // Get stock indices data
  async getIndicesData(symbols: string[] = ['SPX', 'NASDAQ', 'DOW']): Promise<MarketData[]> {
    const cacheKey = `indices_${symbols.join('_')}`;
    const cached = this.cache.get<MarketData[]>(cacheKey);
    if (cached) return cached;

    try {
      const results: MarketData[] = [];
      
             for (const symbol of symbols) {
         const yahooSymbol = SYMBOL_MAPPINGS.INDICES[symbol as keyof typeof SYMBOL_MAPPINGS.INDICES]?.yahoo || symbol;
        const url = `${API_URLS.YAHOO_FINANCE}/${yahooSymbol}?interval=1d&range=1d`;
        
        try {
          const response = await this.makeRequest<any>(url, 'YAHOO_FINANCE');
          const result = response.chart?.result?.[0];
          
          if (result?.meta && result?.indicators?.quote?.[0]) {
            const meta = result.meta;
            const quote = result.indicators.quote[0];
            const timestamps = result.timestamp;
            
            if (timestamps && timestamps.length > 0) {
              const lastIndex = timestamps.length - 1;
              const currentPrice = quote.close[lastIndex] || meta.regularMarketPrice;
              const previousPrice = quote.close[lastIndex - 1] || currentPrice;
              
              results.push({
                symbol: symbol,
                price: currentPrice,
                change: currentPrice - previousPrice,
                changePercent: ((currentPrice - previousPrice) / previousPrice) * 100,
                volume: quote.volume[lastIndex] || 0,
                high24h: Math.max(...quote.high.filter((h: number) => h !== null)),
                low24h: Math.min(...quote.low.filter((l: number) => l !== null)),
                timestamp: Date.now(),
                source: 'Yahoo Finance'
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to get ${symbol} from Yahoo Finance:`, error);
        }
      }

      if (results.length > 0) {
        this.cache.set(cacheKey, results, CACHE_CONFIG.MARKET_DATA_TTL);
        return results;
      }

      throw new Error('No data from primary source');

    } catch (error) {
      console.error('Indices API failed:', error);
      return this.getMockIndicesData(symbols);
    }
<<<<<<< HEAD
=======

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
>>>>>>> main
  }

<<<<<<< HEAD
  // Get commodities data
  async getCommoditiesData(commodities: string[] = ['GOLD', 'SILVER', 'OIL']): Promise<MarketData[]> {
    const cacheKey = `commodities_${commodities.join('_')}`;
    const cached = this.cache.get<MarketData[]>(cacheKey);
    if (cached) return cached;

    try {
      const results: MarketData[] = [];
      
             for (const commodity of commodities) {
         const yahooSymbol = SYMBOL_MAPPINGS.COMMODITIES[commodity as keyof typeof SYMBOL_MAPPINGS.COMMODITIES]?.yahoo;
        if (!yahooSymbol) continue;
        
        const url = `${API_URLS.YAHOO_FINANCE}/${yahooSymbol}?interval=1d&range=1d`;
        
        try {
          const response = await this.makeRequest<any>(url, 'YAHOO_FINANCE');
          const result = response.chart?.result?.[0];
          
          if (result?.meta && result?.indicators?.quote?.[0]) {
            const meta = result.meta;
            const quote = result.indicators.quote[0];
            const timestamps = result.timestamp;
            
            if (timestamps && timestamps.length > 0) {
              const lastIndex = timestamps.length - 1;
              const currentPrice = quote.close[lastIndex] || meta.regularMarketPrice;
              const previousPrice = quote.close[lastIndex - 1] || currentPrice;
              
              results.push({
                symbol: commodity,
                price: currentPrice,
                change: currentPrice - previousPrice,
                changePercent: ((currentPrice - previousPrice) / previousPrice) * 100,
                volume: quote.volume[lastIndex] || 0,
                high24h: Math.max(...quote.high.filter((h: number) => h !== null)),
                low24h: Math.min(...quote.low.filter((l: number) => l !== null)),
                timestamp: Date.now(),
                source: 'Yahoo Finance'
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to get ${commodity} from Yahoo Finance:`, error);
        }
      }

      if (results.length > 0) {
        this.cache.set(cacheKey, results, CACHE_CONFIG.MARKET_DATA_TTL);
        return results;
      }

      throw new Error('No data from primary source');

    } catch (error) {
      console.error('Commodities API failed:', error);
      return this.getMockCommoditiesData(commodities);
    }
  }

  // Get historical OHLC data
  async getHistoricalData(
    symbol: string, 
    interval: string = '1h', 
    limit: number = 100
  ): Promise<OHLCData[]> {
    const cacheKey = `historical_${symbol}_${interval}_${limit}`;
    const cached = this.cache.get<OHLCData[]>(cacheKey);
    if (cached) return cached;

    try {
      // Try Twelve Data first
      const url = `${API_URLS.TWELVE_DATA}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${limit}&apikey=${API_KEYS.TWELVE_DATA}`;
      
      const response = await this.makeRequest<any>(url, 'TWELVE_DATA');
      
      if (response.values) {
        const ohlcData: OHLCData[] = response.values.map((item: any) => ({
          timestamp: new Date(item.datetime).getTime(),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseFloat(item.volume || 0)
        })).reverse(); // Reverse to get chronological order

        this.cache.set(cacheKey, ohlcData, CACHE_CONFIG.MARKET_DATA_TTL);
        return ohlcData;
      }

      throw new Error('No historical data available');

    } catch (error) {
      console.error('Historical data API failed:', error);
      return this.getMockHistoricalData(symbol, limit);
    }
  }

  // Get market news with sentiment analysis
  async getMarketNews(query: string = 'finance', limit: number = 20): Promise<NewsItem[]> {
    const cacheKey = `news_${query}_${limit}`;
    const cached = this.cache.get<NewsItem[]>(cacheKey);
    if (cached) return cached;

    try {
      // Use a free news API
      const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=${limit}&apiKey=${API_KEYS.NEWS_API}`;
      
      const response = await this.makeRequest<any>(url, 'NEWS_API');
      
      if (response.articles) {
        const news: NewsItem[] = response.articles.map((article: any, index: number) => ({
          id: `news_${Date.now()}_${index}`,
          title: article.title,
          summary: article.description || article.title,
          url: article.url,
          source: article.source?.name || 'Unknown',
          publishedAt: article.publishedAt,
          sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
          relevanceScore: Math.random() * 0.3 + 0.7 // Mock relevance score
        }));

        this.cache.set(cacheKey, news, CACHE_CONFIG.NEWS_TTL);
        return news;
      }

      throw new Error('No news data available');

    } catch (error) {
      console.error('News API failed:', error);
      return this.getMockNews(limit);
    }
  }

  // Get economic calendar events
  async getEconomicEvents(days: number = 7): Promise<EconomicEvent[]> {
    const cacheKey = `economic_events_${days}`;
    const cached = this.cache.get<EconomicEvent[]>(cacheKey);
    if (cached) return cached;

    try {
      // Mock economic events for now (replace with real API)
      const events = this.getMockEconomicEvents(days);
      this.cache.set(cacheKey, events, CACHE_CONFIG.ECONOMIC_DATA_TTL);
      return events;

    } catch (error) {
      console.error('Economic calendar API failed:', error);
      return this.getMockEconomicEvents(days);
    }
  }

  // Get sentiment data
  async getSentimentData(symbols: string[]): Promise<SentimentData[]> {
    const cacheKey = `sentiment_${symbols.join('_')}`;
    const cached = this.cache.get<SentimentData[]>(cacheKey);
    if (cached) return cached;

    try {
      const sentimentData: SentimentData[] = [];

      // Get Fear & Greed Index for crypto
      if (symbols.some(s => ['BTC', 'ETH', 'bitcoin', 'ethereum'].includes(s))) {
        try {
          const fgResponse = await this.makeRequest<any>(`${API_URLS.FEAR_GREED_INDEX}`, 'FEAR_GREED');
          
          if (fgResponse.data && fgResponse.data.length > 0) {
            const fgIndex = parseInt(fgResponse.data[0].value);
            
            sentimentData.push({
              symbol: 'CRYPTO_OVERALL',
              fearGreedIndex: fgIndex,
              socialSentiment: this.calculateSocialSentiment(fgIndex),
              institutionalSentiment: Math.random() * 40 + 30, // Mock
              retailSentiment: Math.random() * 40 + 30, // Mock
              newsScore: Math.random() * 40 + 30, // Mock
              overallScore: fgIndex,
              timestamp: Date.now()
            });
          }
        } catch (error) {
          console.warn('Fear & Greed Index failed:', error);
        }
      }

      // Add mock sentiment for other symbols
      for (const symbol of symbols) {
        if (!sentimentData.find(s => s.symbol === symbol)) {
          sentimentData.push({
            symbol,
            socialSentiment: Math.random() * 40 + 30,
            institutionalSentiment: Math.random() * 40 + 30,
            retailSentiment: Math.random() * 40 + 30,
            newsScore: Math.random() * 40 + 30,
            overallScore: Math.random() * 40 + 30,
            timestamp: Date.now()
          });
        }
      }

      this.cache.set(cacheKey, sentimentData, CACHE_CONFIG.SENTIMENT_TTL);
      return sentimentData;

    } catch (error) {
      console.error('Sentiment API failed:', error);
      return this.getMockSentimentData(symbols);
    }
  }

  // Helper methods for sentiment analysis
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['gain', 'rise', 'up', 'positive', 'bull', 'growth', 'increase'];
    const negativeWords = ['loss', 'fall', 'down', 'negative', 'bear', 'decline', 'decrease'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateSocialSentiment(fearGreedIndex: number): number {
    // Convert Fear & Greed Index (0-100) to social sentiment
    return Math.min(100, Math.max(0, fearGreedIndex + Math.random() * 20 - 10));
  }

  // Mock data methods for fallback
  private getMockCryptoData(symbols: string[]): MarketData[] {
    const mockPrices: Record<string, number> = {
      bitcoin: 45000 + Math.random() * 10000,
      ethereum: 3000 + Math.random() * 1000,
      cardano: 0.5 + Math.random() * 0.3
    };

    return symbols.map(symbol => {
      const basePrice = mockPrices[symbol] || Math.random() * 100;
      const change = (Math.random() - 0.5) * basePrice * 0.1;
      
      return {
        symbol: symbol.toUpperCase(),
        price: basePrice,
        change,
        changePercent: (change / basePrice) * 100,
        volume: Math.random() * 1000000000,
        high24h: basePrice * (1 + Math.random() * 0.05),
        low24h: basePrice * (1 - Math.random() * 0.05),
        timestamp: Date.now(),
        source: 'Mock Data'
      };
=======
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
>>>>>>> main
    });
    
    currentPrice = close;
  }
  
  return data;
};

<<<<<<< HEAD
  private getMockForexData(pairs: string[]): MarketData[] {
    const mockRates: Record<string, number> = {
      'EUR/USD': 1.0500 + Math.random() * 0.1,
      'GBP/USD': 1.2500 + Math.random() * 0.1,
      'USD/JPY': 150 + Math.random() * 10,
      'AUD/USD': 0.6500 + Math.random() * 0.05,
      'USD/CAD': 1.3500 + Math.random() * 0.05
    };
=======
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
>>>>>>> main

    return pairs.map(pair => {
      const baseRate = mockRates[pair] || 1 + Math.random() * 0.1;
      const change = (Math.random() - 0.5) * baseRate * 0.01;
      
      return {
        symbol: pair,
        price: baseRate,
        change,
        changePercent: (change / baseRate) * 100,
        volume: Math.random() * 1000000,
        high24h: baseRate * (1 + Math.random() * 0.01),
        low24h: baseRate * (1 - Math.random() * 0.01),
        timestamp: Date.now(),
        source: 'Mock Data'
      };
    });
  }

  private getMockIndicesData(symbols: string[]): MarketData[] {
    const mockPrices: Record<string, number> = {
      SPX: 4500 + Math.random() * 500,
      NASDAQ: 15000 + Math.random() * 1000,
      DOW: 35000 + Math.random() * 2000
    };

    return symbols.map(symbol => {
      const basePrice = mockPrices[symbol] || Math.random() * 1000 + 1000;
      const change = (Math.random() - 0.5) * basePrice * 0.02;
      
      return {
        symbol: symbol,
        price: basePrice,
        change,
        changePercent: (change / basePrice) * 100,
        volume: Math.random() * 100000000,
        high24h: basePrice * (1 + Math.random() * 0.02),
        low24h: basePrice * (1 - Math.random() * 0.02),
        timestamp: Date.now(),
        source: 'Mock Data'
      };
    });
  }

  private getMockCommoditiesData(commodities: string[]): MarketData[] {
    const mockPrices: Record<string, number> = {
      GOLD: 2000 + Math.random() * 100,
      SILVER: 25 + Math.random() * 5,
      OIL: 80 + Math.random() * 20
    };

    return commodities.map(commodity => {
      const basePrice = mockPrices[commodity] || Math.random() * 100 + 50;
      const change = (Math.random() - 0.5) * basePrice * 0.03;
      
      return {
        symbol: commodity,
        price: basePrice,
        change,
        changePercent: (change / basePrice) * 100,
        volume: Math.random() * 10000000,
        high24h: basePrice * (1 + Math.random() * 0.03),
        low24h: basePrice * (1 - Math.random() * 0.03),
        timestamp: Date.now(),
        source: 'Mock Data'
      };
    });
  }

  private getMockHistoricalData(symbol: string, limit: number): OHLCData[] {
    const data: OHLCData[] = [];
    let basePrice = 100 + Math.random() * 100;
    const now = Date.now();
    
    for (let i = limit; i >= 0; i--) {
      const timestamp = now - (i * 3600000); // 1 hour intervals
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = basePrice;
      const close = basePrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000
      });
      
      basePrice = close;
    }
    
    return data;
  }

  private getMockNews(limit: number): NewsItem[] {
    const headlines = [
      'Markets Rally on Positive Economic Data',
      'Federal Reserve Considers Interest Rate Changes',
      'Tech Stocks Show Strong Performance',
      'Oil Prices Fluctuate on Global Events',
      'Cryptocurrency Market Sees Mixed Results',
      'Gold Prices Reach New Highs',
      'Economic Indicators Point to Growth',
      'Central Bank Policy Updates Expected'
    ];

    return Array.from({ length: limit }, (_, index) => ({
      id: `mock_news_${index}`,
      title: headlines[index % headlines.length],
      summary: `Mock news article about market developments and economic trends. Article ${index + 1}.`,
      url: `https://example.com/news/${index}`,
      source: 'Mock Financial News',
      publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
      relevanceScore: Math.random() * 0.3 + 0.7
    }));
  }

  private getMockEconomicEvents(days: number): EconomicEvent[] {
    const events = [
      'GDP Growth Rate',
      'Unemployment Rate',
      'Consumer Price Index',
      'Federal Funds Rate Decision',
      'Non-Farm Payrolls',
      'Retail Sales',
      'Industrial Production',
      'Consumer Confidence'
    ];

    const countries = ['US', 'EU', 'UK', 'JP', 'CN'];
    const impacts: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

    return Array.from({ length: days * 2 }, (_, index) => ({
      id: `event_${index}`,
      title: events[index % events.length],
      country: countries[index % countries.length],
      currency: countries[index % countries.length] === 'US' ? 'USD' : 'EUR',
      impact: impacts[index % impacts.length],
      actual: Math.random() > 0.5 ? (Math.random() * 10).toFixed(1) + '%' : undefined,
      forecast: (Math.random() * 10).toFixed(1) + '%',
      previous: (Math.random() * 10).toFixed(1) + '%',
      timestamp: new Date(Date.now() + Math.random() * days * 86400000).toISOString()
    }));
  }

  private getMockSentimentData(symbols: string[]): SentimentData[] {
    return symbols.map(symbol => ({
      symbol,
      fearGreedIndex: Math.floor(Math.random() * 100),
      socialSentiment: Math.random() * 100,
      institutionalSentiment: Math.random() * 100,
      retailSentiment: Math.random() * 100,
      newsScore: Math.random() * 100,
      overallScore: Math.random() * 100,
      timestamp: Date.now()
    }));
  }

  // Cache management methods
  getCacheStats() {
    return {
      size: this.cache.size(),
      // Add more cache statistics as needed
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const dataService = new EnhancedDataService();
export default dataService;