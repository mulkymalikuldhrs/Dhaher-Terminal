
// API Configuration and Keys
// Note: In a production environment, these keys should be stored securely
// and not exposed in the client-side code

// API keys for production use
export const API_KEYS = {
  // Alpha Vantage API - Free tier available
  ALPHA_VANTAGE: "demo",
  
  // Finnhub API - Free tier available
  FINNHUB: "sandbox_c19k5iaad3i8ik9rlhr0",
  
  // NewsAPI - Free tier available
  NEWS_API: "demo",
  
  // CoinGecko API - No key required for basic usage
  COINGECKO: "",
  
  // Federal Reserve Economic Data (FRED) - Free
  FRED: "",
  
  // Exchange Rates API - Free
  EXCHANGE_RATES: "",
  
  // JSONVat for VAT rates - Free
  JSONVAT: ""
};

// Base URLs for APIs
export const API_URLS = {
  ALPHA_VANTAGE: "https://www.alphavantage.co/query",
  FINNHUB: "https://finnhub.io/api/v1",
  COINGECKO: "https://api.coingecko.com/api/v3",
  NEWS_API: "https://newsapi.org/v2",
  FRED: "https://api.stlouisfed.org/fred",
  EXCHANGE_RATES: "https://api.exchangerate-api.com/v4/latest",
  FIXER: "https://api.fixer.io/latest",
  CURRENCYLAYER: "https://api.currencylayer.com/live",
  POLYGON: "https://api.polygon.io",
  YAHOO_FINANCE_PROXY: "https://query1.finance.yahoo.com/v8/finance/chart",
  TWELVE_DATA: "https://api.twelvedata.com",
  CFTC_COT: "https://publicreporting.cftc.gov/resource",
  FOREX_FACTORY: "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
  ECONOMIC_CALENDAR: "https://api.forexfactory.com/calendar"
};

// WebSocket URLs
export const WEBSOCKET_URLS = {
  FINNHUB: "wss://ws.finnhub.io"
};

// Asset type mappings for different APIs
export const ASSET_TYPE_MAPPINGS = {
  forex_major: {
    apiSource: "ALPHA_VANTAGE",
    endpoint: "FX_INTRADAY"
  },
  forex_cross: {
    apiSource: "ALPHA_VANTAGE", 
    endpoint: "FX_INTRADAY"
  },
  forex_exotic: {
    apiSource: "ALPHA_VANTAGE",
    endpoint: "FX_INTRADAY"
  },
  commodities: {
    apiSource: "YAHOO_FINANCE_PROXY",
    endpoint: "chart"
  },
  indices: {
    apiSource: "YAHOO_FINANCE_PROXY",
    endpoint: "chart"
  },
  crypto: {
    apiSource: "COINGECKO",
    endpoint: "coins/markets"
  }
};
