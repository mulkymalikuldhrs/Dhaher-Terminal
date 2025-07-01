// Enhanced API Configuration for Dhaher Terminal Pro v2.0
// All APIs used are public and free with generous rate limits

// API keys for enhanced features (all free tier)
export const API_KEYS = {
  // Alpha Vantage API - Free tier: 25 requests/day
  ALPHA_VANTAGE: "demo",
  
  // Finnhub API - Free tier: 60 calls/minute
  FINNHUB: "sandbox_c19k5iaad3i8ik9rlhr0",
  
  // NewsAPI - Free tier: 1000 requests/month
  NEWS_API: "demo",
  
  // CoinGecko API - No key required, 10-50 calls/minute
  COINGECKO: "",
  
  // Federal Reserve Economic Data (FRED) - Free, unlimited
  FRED: "",
  
  // Exchange Rates API - Free, 1500 requests/month
  EXCHANGE_RATES: "",
  
  // Polygon.io - Free tier: 5 calls/minute
  POLYGON: "demo",
  
  // Twelve Data - Free tier: 800 requests/day
  TWELVE_DATA: "demo",
  
  // Economic Calendar API - Free
  ECONOMIC_CALENDAR: "",
  
  // Crypto Fear & Greed Index - Free
  FEAR_GREED: "",
  
  // Market Stack - Free tier: 1000 requests/month
  MARKET_STACK: "demo"
};

// Enhanced Base URLs for APIs
export const API_URLS = {
  // Primary Data Sources
  ALPHA_VANTAGE: "https://www.alphavantage.co/query",
  FINNHUB: "https://finnhub.io/api/v1",
  COINGECKO: "https://api.coingecko.com/api/v3",
  TWELVE_DATA: "https://api.twelvedata.com",
  POLYGON: "https://api.polygon.io",
  
  // News & Economic Data
  NEWS_API: "https://newsapi.org/v2",
  FRED: "https://api.stlouisfed.org/fred",
  ECONOMIC_CALENDAR: "https://api.investing.com/api/financialdata",
  
  // Currency & Exchange Rates
  EXCHANGE_RATES: "https://api.exchangerate-api.com/v4/latest",
  FIXER: "https://api.fixer.io/latest",
  CURRENCYLAYER: "https://api.currencylayer.com/live",
  
  // Alternative Data Sources
  YAHOO_FINANCE: "https://query1.finance.yahoo.com/v8/finance/chart",
  YAHOO_FINANCE_V2: "https://query2.finance.yahoo.com/v10/finance/quoteSummary",
  MARKET_STACK: "https://api.marketstack.com/v1",
  
  // Sentiment & Social Data
  FEAR_GREED_INDEX: "https://api.alternative.me/fng",
  REDDIT_SENTIMENT: "https://www.reddit.com/r/stocks/hot.json",
  
  // Technical Analysis
  TAAPI: "https://api.taapi.io",
  TRADING_VIEW: "https://scanner.tradingview.com",
  
  // Crypto Specific
  COINBASE: "https://api.coinbase.com/v2",
  BINANCE: "https://api.binance.com/api/v3",
  COINGLASS: "https://open-api.coinglass.com/public/v2"
};

// Enhanced WebSocket URLs
export const WEBSOCKET_URLS = {
  FINNHUB: "wss://ws.finnhub.io",
  BINANCE: "wss://stream.binance.com:9443/ws",
  COINBASE: "wss://ws-feed.pro.coinbase.com",
  POLYGON: "wss://socket.polygon.io",
  TWELVE_DATA: "wss://ws.twelvedata.com/v1/quotes/price",
  ALPHA_VANTAGE: "wss://ws.alpha-vantage-api.com/ws"
};

// Enhanced Asset type mappings with fallback strategies
export const ASSET_TYPE_MAPPINGS = {
  forex_major: {
    primary: { apiSource: "TWELVE_DATA", endpoint: "time_series" },
    fallback: { apiSource: "ALPHA_VANTAGE", endpoint: "FX_INTRADAY" },
    websocket: "TWELVE_DATA"
  },
  forex_cross: {
    primary: { apiSource: "TWELVE_DATA", endpoint: "time_series" },
    fallback: { apiSource: "EXCHANGE_RATES", endpoint: "latest" },
    websocket: "TWELVE_DATA"
  },
  forex_exotic: {
    primary: { apiSource: "ALPHA_VANTAGE", endpoint: "FX_INTRADAY" },
    fallback: { apiSource: "EXCHANGE_RATES", endpoint: "latest" },
    websocket: "TWELVE_DATA"
  },
  commodities: {
    primary: { apiSource: "TWELVE_DATA", endpoint: "time_series" },
    fallback: { apiSource: "YAHOO_FINANCE", endpoint: "chart" },
    websocket: "TWELVE_DATA"
  },
  indices: {
    primary: { apiSource: "TWELVE_DATA", endpoint: "time_series" },
    fallback: { apiSource: "YAHOO_FINANCE", endpoint: "chart" },
    websocket: "TWELVE_DATA"
  },
  crypto: {
    primary: { apiSource: "COINGECKO", endpoint: "coins/markets" },
    fallback: { apiSource: "BINANCE", endpoint: "ticker/24hr" },
    websocket: "BINANCE"
  },
  stocks: {
    primary: { apiSource: "TWELVE_DATA", endpoint: "time_series" },
    fallback: { apiSource: "YAHOO_FINANCE", endpoint: "chart" },
    websocket: "TWELVE_DATA"
  }
};

// Rate limiting configuration
export const RATE_LIMITS = {
  ALPHA_VANTAGE: { requests: 5, window: 60000 }, // 5 per minute
  FINNHUB: { requests: 60, window: 60000 }, // 60 per minute
  COINGECKO: { requests: 30, window: 60000 }, // 30 per minute
  TWELVE_DATA: { requests: 8, window: 60000 }, // 8 per minute
  NEWS_API: { requests: 100, window: 86400000 }, // 100 per day
  POLYGON: { requests: 5, window: 60000 }, // 5 per minute
  YAHOO_FINANCE: { requests: 100, window: 60000 }, // Conservative limit
  EXCHANGE_RATES: { requests: 10, window: 60000 } // 10 per minute
};

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000, // 5 minutes
  MARKET_DATA_TTL: 60000, // 1 minute for real-time data
  NEWS_TTL: 900000, // 15 minutes for news
  ECONOMIC_DATA_TTL: 3600000, // 1 hour for economic data
  SENTIMENT_TTL: 1800000 // 30 minutes for sentiment data
};

// Error handling configuration
export const ERROR_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,
  CIRCUIT_BREAKER_THRESHOLD: 5,
  CIRCUIT_BREAKER_TIMEOUT: 300000 // 5 minutes
};

// Market hours configuration
export const MARKET_HOURS = {
  FOREX: { open: 0, close: 24, timezone: "UTC" },
  US_STOCKS: { open: 14.5, close: 21, timezone: "UTC" }, // 9:30 AM - 4:00 PM EST
  CRYPTO: { open: 0, close: 24, timezone: "UTC" },
  COMMODITIES: { open: 1, close: 23, timezone: "UTC" }
};

// Symbol mappings for different APIs
export const SYMBOL_MAPPINGS = {
  FOREX: {
    "EUR/USD": { yahoo: "EURUSD=X", twelve: "EUR/USD", alpha: "EURUSD" },
    "GBP/USD": { yahoo: "GBPUSD=X", twelve: "GBP/USD", alpha: "GBPUSD" },
    "USD/JPY": { yahoo: "USDJPY=X", twelve: "USD/JPY", alpha: "USDJPY" },
    "AUD/USD": { yahoo: "AUDUSD=X", twelve: "AUD/USD", alpha: "AUDUSD" },
    "USD/CAD": { yahoo: "USDCAD=X", twelve: "USD/CAD", alpha: "USDCAD" }
  },
  COMMODITIES: {
    "GOLD": { yahoo: "GC=F", twelve: "XAU/USD", symbol: "XAUUSD" },
    "SILVER": { yahoo: "SI=F", twelve: "XAG/USD", symbol: "XAGUSD" },
    "OIL": { yahoo: "CL=F", twelve: "WTI/USD", symbol: "WTIUSD" },
    "NATURAL_GAS": { yahoo: "NG=F", twelve: "NG/USD", symbol: "NGAS" }
  },
  INDICES: {
    "SPX": { yahoo: "^GSPC", twelve: "SPX", symbol: "SPX500" },
    "NASDAQ": { yahoo: "^IXIC", twelve: "IXIC", symbol: "NAS100" },
    "DOW": { yahoo: "^DJI", twelve: "DJI", symbol: "US30" },
    "FTSE": { yahoo: "^FTSE", twelve: "UKX", symbol: "UK100" }
  }
};
