
import axios from 'axios';
import { API_KEYS, API_URLS } from './apiConfig';
import { Asset } from '../types';

// COT (Commitment of Traders) Data Service
export const fetchCOTData = async (asset: Asset) => {
  try {
    // Map asset to CFTC commodity code
    const commodityMap: Record<string, string> = {
      'eurusd': '099741',  // Euro FX
      'gbpusd': '096742',  // British Pound
      'usdjpy': '097741',  // Japanese Yen
      'audusd': '232741',  // Australian Dollar
      'usdcad': '090741',  // Canadian Dollar
      'usdchf': '092741',  // Swiss Franc
      'nzdusd': '112741',  // New Zealand Dollar
      'xauusd': '088691',  // Gold
      'xagusd': '084691',  // Silver
      'wtiusd': '067651',  // Crude Oil WTI
      'spx500': '138741',  // S&P 500
      'nas100': '209742',  // NASDAQ 100
    };

    const commodityCode = commodityMap[asset.id.toLowerCase()];
    if (!commodityCode) {
      return null;
    }

    // Fetch latest COT report
    const response = await axios.get(`${API_URLS.CFTC_COT}/cotgr2024.json`, {
      params: {
        cftc_contract_market_code: commodityCode,
        $order: 'report_date_as_yyyy_mm_dd DESC',
        $limit: 1
      }
    });

    if (response.data && response.data.length > 0) {
      const cotData = response.data[0];
      
      return {
        reportDate: cotData.report_date_as_yyyy_mm_dd,
        commercialLong: parseInt(cotData.comm_positions_long_all || '0'),
        commercialShort: parseInt(cotData.comm_positions_short_all || '0'),
        nonCommercialLong: parseInt(cotData.noncomm_positions_long_all || '0'),
        nonCommercialShort: parseInt(cotData.noncomm_positions_short_all || '0'),
        netPosition: parseInt(cotData.noncomm_positions_long_all || '0') - parseInt(cotData.noncomm_positions_short_all || '0'),
        trend: parseInt(cotData.noncomm_positions_long_all || '0') > parseInt(cotData.noncomm_positions_short_all || '0') ? 'bullish' : 'bearish'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching COT data:', error);
    return null;
  }
};

// Economic Calendar Service
export const fetchEconomicCalendar = async () => {
  try {
    const response = await axios.get(API_URLS.FOREX_FACTORY);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data
        .filter((event: any) => event.impact === 'High' || event.impact === 'Medium')
        .map((event: any) => ({
          id: `${event.date}_${event.title}`,
          title: event.title,
          country: event.country,
          currency: event.currency,
          impact: event.impact,
          date: new Date(event.date).getTime(),
          forecast: event.forecast,
          previous: event.previous,
          actual: event.actual
        }))
        .sort((a: any, b: any) => a.date - b.date)
        .slice(0, 20); // Next 20 events
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching economic calendar:', error);
    return [];
  }
};

// Retail Sentiment Service
export const fetchRetailSentiment = async (asset: Asset) => {
  try {
    // For demo purposes, we'll generate sentiment based on price action
    const bullishBias = asset.changePercent > 0;
    const volatility = Math.abs(asset.changePercent);
    
    // Simulate retail sentiment (often contrarian to institutional)
    const retailLong = bullishBias ? 
      Math.max(30, 70 - volatility * 2) : 
      Math.min(70, 30 + volatility * 2);
    
    const retailShort = 100 - retailLong;
    
    // Simulate institutional positioning (often contrarian to retail)
    const institutionalLong = 100 - retailLong;
    const institutionalShort = 100 - retailShort;
    
    return {
      retail: {
        long: Math.round(retailLong),
        short: Math.round(retailShort)
      },
      institutional: {
        long: Math.round(institutionalLong),
        short: Math.round(institutionalShort)
      },
      lastUpdate: Date.now()
    };
  } catch (error) {
    console.error('Error fetching retail sentiment:', error);
    return null;
  }
};

// Market News Service
export const fetchMarketNews = async () => {
  try {
    const response = await axios.get(`${API_URLS.NEWS_API}/everything`, {
      params: {
        q: 'forex OR cryptocurrency OR "stock market" OR "central bank"',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: API_KEYS.NEWS_API
      }
    });
    
    if (response.data && response.data.articles) {
      return response.data.articles.map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: new Date(article.publishedAt).getTime(),
        source: article.source.name,
        impact: determineNewsImpact(article.title, article.description)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching market news:', error);
    return [];
  }
};

// Determine news impact based on keywords
const determineNewsImpact = (title: string, description: string): 'high' | 'medium' | 'low' => {
  const text = `${title} ${description}`.toLowerCase();
  
  const highImpactKeywords = ['fed', 'interest rate', 'inflation', 'gdp', 'employment', 'central bank', 'monetary policy'];
  const mediumImpactKeywords = ['earnings', 'trade', 'oil', 'gold', 'bitcoin', 'recession'];
  
  if (highImpactKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  } else if (mediumImpactKeywords.some(keyword => text.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
};

// Liquidity Analysis Service
export const fetchLiquidityData = async (asset: Asset) => {
  try {
    // Simulate liquidity zones based on price action and volume
    const price = asset.price;
    const volatility = Math.abs(asset.changePercent) / 100;
    
    // Generate support and resistance levels
    const levels = [];
    
    // Major support/resistance levels
    for (let i = 1; i <= 5; i++) {
      levels.push({
        type: 'support',
        price: price * (1 - (volatility * i * 0.5)),
        strength: Math.max(1, 6 - i),
        volume: Math.floor(Math.random() * 100000) + 50000
      });
      
      levels.push({
        type: 'resistance',
        price: price * (1 + (volatility * i * 0.5)),
        strength: Math.max(1, 6 - i),
        volume: Math.floor(Math.random() * 100000) + 50000
      });
    }
    
    return levels.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error generating liquidity data:', error);
    return [];
  }
};

// SMC (Smart Money Concepts) Analysis
export const analyzeSMC = async (asset: Asset, chartData: any[]) => {
  try {
    if (!chartData || chartData.length < 50) {
      return null;
    }
    
    const analysis = {
      marketStructure: 'bullish', // or 'bearish' or 'ranging'
      lastBOS: null as any, // Break of Structure
      lastCHoCH: null as any, // Change of Character
      orderBlocks: [] as any[],
      fairValueGaps: [] as any[],
      liquidityLevels: [] as any[],
      bias: 'bullish' as 'bullish' | 'bearish' | 'neutral'
    };
    
    // Analyze last 50 candles for SMC patterns
    const recentData = chartData.slice(-50);
    
    // Detect Break of Structure (BOS)
    let highs = [];
    let lows = [];
    
    for (let i = 0; i < recentData.length; i++) {
      const candle = recentData[i];
      
      // Find swing highs and lows
      if (i > 2 && i < recentData.length - 2) {
        const isSwingHigh = candle.high > recentData[i-1].high && 
                           candle.high > recentData[i-2].high &&
                           candle.high > recentData[i+1].high &&
                           candle.high > recentData[i+2].high;
                           
        const isSwingLow = candle.low < recentData[i-1].low && 
                          candle.low < recentData[i-2].low &&
                          candle.low < recentData[i+1].low &&
                          candle.low < recentData[i+2].low;
        
        if (isSwingHigh) {
          highs.push({ price: candle.high, time: candle.time, index: i });
        }
        
        if (isSwingLow) {
          lows.push({ price: candle.low, time: candle.time, index: i });
        }
      }
    }
    
    // Determine market structure bias
    if (highs.length >= 2 && lows.length >= 2) {
      const recentHighs = highs.slice(-2);
      const recentLows = lows.slice(-2);
      
      const higherHighs = recentHighs[1].price > recentHighs[0].price;
      const higherLows = recentLows[1].price > recentLows[0].price;
      const lowerHighs = recentHighs[1].price < recentHighs[0].price;
      const lowerLows = recentLows[1].price < recentLows[0].price;
      
      if (higherHighs && higherLows) {
        analysis.marketStructure = 'bullish';
        analysis.bias = 'bullish';
      } else if (lowerHighs && lowerLows) {
        analysis.marketStructure = 'bearish';
        analysis.bias = 'bearish';
      } else {
        analysis.marketStructure = 'ranging';
        analysis.bias = 'neutral';
      }
    }
    
    // Detect Fair Value Gaps (FVG)
    for (let i = 1; i < recentData.length - 1; i++) {
      const prev = recentData[i - 1];
      const current = recentData[i];
      const next = recentData[i + 1];
      
      // Bullish FVG: gap between previous low and next high
      if (prev.low > next.high) {
        analysis.fairValueGaps.push({
          type: 'bullish',
          top: prev.low,
          bottom: next.high,
          time: current.time,
          filled: false
        });
      }
      
      // Bearish FVG: gap between previous high and next low
      if (prev.high < next.low) {
        analysis.fairValueGaps.push({
          type: 'bearish',
          top: next.low,
          bottom: prev.high,
          time: current.time,
          filled: false
        });
      }
    }
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing SMC:', error);
    return null;
  }
};
