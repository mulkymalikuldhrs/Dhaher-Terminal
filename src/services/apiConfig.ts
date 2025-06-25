// API Configuration and Keys
// Note: In a production environment, these keys should be stored securely
// and not exposed in the client-side code

// API keys for production use
export const API_KEYS = {
  // FCSAPI for comprehensive market data
  FCSAPI: "CLfBJUPZohf9lONdOpDQdnd6BRwbgaB",
  
  // Alpha Vantage API as fallback
  ALPHA_VANTAGE: "QHZWJNDI1TNNLWV3",
  
  // FinnHub API for additional data
  FINNHUB: "sandbox_c19k5iaad3i8ik9rlhr0",
  
  // TwelveData for real-time institutional data
  TWELVE_DATA: "demo",
  
  // Polygon.io for market data
  POLYGON: "demo",
  
  // Financial Modeling Prep for fundamentals
  FMP: "demo",
  
  // NewsAPI for economic news
  NEWS_API: "demo",
  
  // CoinGecko API for crypto (no key required for basic usage)
};

// Base URLs for APIs
export const API_URLS = {
  FCSAPI: "https://fcsapi.com/api-v3",
  ALPHA_VANTAGE: "https://www.alphavantage.co/query",
  FINNHUB: "https://finnhub.io/api/v1",
  COINGECKO: "https://api.coingecko.com/api/v3",
  YAHOO_FINANCE: "https://query1.finance.yahoo.com/v8/finance",
  TWELVE_DATA: "https://api.twelvedata.com",
  POLYGON: "https://api.polygon.io",
  FMP: "https://financialmodelingprep.com/api/v3",
  NEWS_API: "https://newsapi.org/v2",
  FOREX_FACTORY: "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
  CFTC_COT: "https://publicreporting.cftc.gov/resource",
  FXSSI: "https://fxssi.com/api/v1"
};

// WebSocket URLs
export const WEBSOCKET_URLS = {
  FCSAPI: "wss://fcsapi.com/ws-v3",
  FINNHUB: "wss://ws.finnhub.io"
};

// Asset type mappings for different APIs
export const ASSET_TYPE_MAPPINGS = {
  forex_major: {
    apiSource: "FCSAPI",
    endpoint: "forex/latest"
  },
  forex_cross: {
    apiSource: "FCSAPI",
    endpoint: "forex/latest"
  },
  forex_exotic: {
    apiSource: "FCSAPI",
    endpoint: "forex/latest"
  },
  commodities: {
    apiSource: "FCSAPI",
    endpoint: "commodities/latest"
  },
  indices: {
    apiSource: "FCSAPI",
    endpoint: "stock/indices"
  },
  crypto: {
    apiSource: "FCSAPI",
    endpoint: "crypto/latest"
  }
};
