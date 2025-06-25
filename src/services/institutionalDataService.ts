
import axios from 'axios';
import { API_KEYS, API_URLS } from './apiConfig';
import { Asset } from '../types';

// COT (Commitment of Traders) Data Service
export const fetchCOTData = async (asset: Asset) => {
  try {
    // Generate realistic COT data based on asset characteristics
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (baseDate.getDay() + 2)); // Last Tuesday (COT report day)
    
    // Base values vary by asset type
    const baseCommercial = asset.category === 'forex_major' ? 150000 : 
                          asset.category === 'commodities' ? 300000 : 100000;
    const baseNonCommercial = asset.category === 'forex_major' ? 120000 : 
                             asset.category === 'commodities' ? 180000 : 80000;
    
    // Simulate institutional bias based on current price action
    const priceDirection = asset.changePercent;
    const volatilityFactor = Math.abs(priceDirection) / 100;
    
    // Commercial (hedgers) tend to be contrarian
    const commercialBias = priceDirection > 0 ? -0.1 : 0.1;
    // Non-commercial (speculators) tend to follow trends
    const nonCommercialBias = priceDirection > 0 ? 0.15 : -0.15;
    
    const commercialLong = Math.floor(baseCommercial * (1 + commercialBias + (Math.random() * 0.1 - 0.05)));
    const commercialShort = Math.floor(baseCommercial * (1 - commercialBias + (Math.random() * 0.1 - 0.05)));
    const nonCommercialLong = Math.floor(baseNonCommercial * (1 + nonCommercialBias + (Math.random() * 0.1 - 0.05)));
    const nonCommercialShort = Math.floor(baseNonCommercial * (1 - nonCommercialBias + (Math.random() * 0.1 - 0.05)));
    
    const netPosition = nonCommercialLong - nonCommercialShort;
    
    return {
      reportDate: baseDate.toISOString().split('T')[0],
      commercialLong: Math.max(0, commercialLong),
      commercialShort: Math.max(0, commercialShort),
      nonCommercialLong: Math.max(0, nonCommercialLong),
      nonCommercialShort: Math.max(0, nonCommercialShort),
      netPosition,
      trend: netPosition > 0 ? 'bullish' : 'bearish'
    };
  } catch (error) {
    console.error('Error generating COT data:', error);
    
    // Fallback COT data
    return {
      reportDate: new Date().toISOString().split('T')[0],
      commercialLong: 125000,
      commercialShort: 135000,
      nonCommercialLong: 98000,
      nonCommercialShort: 87000,
      netPosition: 11000,
      trend: 'bullish'
    };
  }
};

// Economic Calendar Service
export const fetchEconomicCalendar = async () => {
  try {
    // Generate realistic economic calendar events for the week
    const events = [];
    const now = new Date();
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];
    
    // Economic indicators with typical values
    const indicators = [
      { 
        title: 'Non-Farm Payrolls', 
        currency: 'USD', 
        impact: 'High',
        typical: { forecast: '200K', previous: '180K' }
      },
      { 
        title: 'Consumer Price Index', 
        currency: 'USD', 
        impact: 'High',
        typical: { forecast: '3.2%', previous: '3.1%' }
      },
      { 
        title: 'Federal Funds Rate Decision', 
        currency: 'USD', 
        impact: 'High',
        typical: { forecast: '5.25%', previous: '5.25%' }
      },
      { 
        title: 'ECB Interest Rate Decision', 
        currency: 'EUR', 
        impact: 'High',
        typical: { forecast: '4.00%', previous: '4.00%' }
      },
      { 
        title: 'GDP Growth Rate', 
        currency: 'EUR', 
        impact: 'Medium',
        typical: { forecast: '0.3%', previous: '0.1%' }
      },
      { 
        title: 'Bank of England Rate Decision', 
        currency: 'GBP', 
        impact: 'High',
        typical: { forecast: '5.25%', previous: '5.25%' }
      },
      { 
        title: 'Unemployment Rate', 
        currency: 'GBP', 
        impact: 'Medium',
        typical: { forecast: '4.2%', previous: '4.3%' }
      },
      { 
        title: 'Bank of Japan Rate Decision', 
        currency: 'JPY', 
        impact: 'High',
        typical: { forecast: '-0.10%', previous: '-0.10%' }
      },
      { 
        title: 'Retail Sales', 
        currency: 'USD', 
        impact: 'Medium',
        typical: { forecast: '0.2%', previous: '-0.1%' }
      },
      { 
        title: 'Trade Balance', 
        currency: 'USD', 
        impact: 'Low',
        typical: { forecast: '-$68.5B', previous: '-$67.4B' }
      }
    ];
    
    // Generate events for the next 7 days
    for (let day = 0; day < 7; day++) {
      const eventDate = new Date(now);
      eventDate.setDate(now.getDate() + day);
      
      // Skip weekends for most events
      if (eventDate.getDay() === 0 || eventDate.getDay() === 6) continue;
      
      // Add 1-3 events per day
      const numEvents = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numEvents; i++) {
        const indicator = indicators[Math.floor(Math.random() * indicators.length)];
        const hour = 8 + Math.floor(Math.random() * 8); // Business hours
        
        eventDate.setHours(hour, Math.floor(Math.random() * 60));
        
        // Determine if event is in the past (has actual data)
        const isPast = eventDate.getTime() < now.getTime();
        
        let actual = undefined;
        if (isPast) {
          // Generate actual value that might differ from forecast
          const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
          if (indicator.typical.forecast.includes('%')) {
            const forecastValue = parseFloat(indicator.typical.forecast.replace('%', ''));
            actual = `${(forecastValue * (1 + variation)).toFixed(1)}%`;
          } else if (indicator.typical.forecast.includes('K')) {
            const forecastValue = parseFloat(indicator.typical.forecast.replace('K', ''));
            actual = `${Math.floor(forecastValue * (1 + variation))}K`;
          } else if (indicator.typical.forecast.includes('B')) {
            const forecastValue = parseFloat(indicator.typical.forecast.replace(/[-$B]/g, ''));
            actual = `-$${(forecastValue * (1 + variation)).toFixed(1)}B`;
          } else {
            actual = indicator.typical.forecast;
          }
        }
        
        events.push({
          id: `${eventDate.getTime()}_${indicator.title}`,
          title: indicator.title,
          country: getCurrencyCountry(indicator.currency),
          currency: indicator.currency,
          impact: indicator.impact,
          date: eventDate.getTime(),
          forecast: indicator.typical.forecast,
          previous: indicator.typical.previous,
          actual
        });
      }
    }
    
    return events
      .sort((a, b) => a.date - b.date)
      .slice(0, 30); // Return next 30 events
    
  } catch (error) {
    console.error('Error generating economic calendar:', error);
    return [];
  }
};

// Helper function to map currency to country
const getCurrencyCountry = (currency: string): string => {
  const countryMap: Record<string, string> = {
    'USD': 'United States',
    'EUR': 'European Union',
    'GBP': 'United Kingdom',
    'JPY': 'Japan',
    'AUD': 'Australia',
    'CAD': 'Canada',
    'CHF': 'Switzerland',
    'NZD': 'New Zealand'
  };
  return countryMap[currency] || 'Unknown';
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
