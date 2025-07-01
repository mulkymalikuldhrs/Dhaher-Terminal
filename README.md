<<<<<<< HEAD
# 🚀 Dhaher Terminal Pro v2.0 - Advanced Trading Terminal

**Professional Bloomberg-style trading dashboard with AI-powered analytics and real-time market data**
=======
# Dhaher Terminal - Bloomberg-Style Trading Dashboard
>>>>>>> main

> 🎯 **Major Upgrade Complete!** - Now featuring enhanced API integrations, modern React architecture, and advanced trading tools.

<<<<<<< HEAD
## ✨ What's New in v2.0

### 🏗️ **Complete Architecture Overhaul**
- **Modern React 19** with TypeScript 5.7
- **Zustand State Management** with persistence and devtools
- **Enhanced Error Handling** with circuit breakers and retry logic
- **Framer Motion Animations** for smooth UI interactions
- **Vite 6** for lightning-fast development

### 📊 **Advanced Market Data Engine**
- **Multi-API Integration** with automatic failover
- **Rate Limiting & Caching** for optimal performance  
- **Real-time WebSocket** connections
- **Smart Data Aggregation** from 10+ sources
- **Historical Data** with multiple timeframes
=======
**Dibuat oleh [Mulky Malikul Dhaher](mailto:mulkymalikuldhr@mail.com) di Indonesia dengan ❤️**

> "Democratizing professional trading tools for everyone"

## Fitur Utama

### 📊 Real-Time Market Data
- Multi-asset trading dashboard (Forex, Crypto, Commodities, Indices)
- Chart candlestick dengan timeframe multiple (1m, 5m, 15m, 1h, 4h, 1d)
- Data harga real-time dari API publik gratis
- NEW: Order Flow / Cluster Delta heatmap untuk memvisualisasikan delta bid-ask di setiap level harga

### 📈 Analisis Profesional
- COT (Commitment of Traders) analysis
- Smart Money Concepts (SMC) analysis
- Market structure analysis dengan bias detection
- Order Flow (Cluster Delta) untuk menganalisis tekanan beli vs jual secara granular
- Economic calendar integration
>>>>>>> main

### 🤖 **AI-Powered Features**
- **Intelligent Signal Generation** with confidence scoring
- **Sentiment Analysis** from news and social media
- **Pattern Recognition** for market structure analysis
- **Risk Assessment** with dynamic alerts

<<<<<<< HEAD
### 🔌 **Enhanced API Integrations**
=======
### 🎯 Trading Tools
- Retail sentiment tracking
- Institutional positioning analysis
- Market heatmap visualization
- Order Flow Cluster Delta panel (mirip footprint chart) untuk semua aset
- Multi-panel workspace seperti Bloomberg Terminal
>>>>>>> main

#### Primary Data Sources (All Free Tier)
- **CoinGecko** - Cryptocurrency data (10-50 calls/min)
- **Twelve Data** - Forex, stocks, indices (800 calls/day)
- **Yahoo Finance** - Real-time market data (unlimited)
- **Exchange Rates API** - Currency data (1500 calls/month)
- **Binance** - Crypto market data & WebSocket feeds

<<<<<<< HEAD
#### Advanced Data Sources
- **Fear & Greed Index** - Market sentiment indicators
- **Economic Calendar** - Major economic events
- **NewsAPI** - Financial news with sentiment analysis
- **Reddit/Social** - Social sentiment tracking
=======
### API Gratis yang Digunakan
- **CoinGecko API**: Cryptocurrency market data (gratis, tanpa API key)
- **Yahoo Finance API**: Stock indices dan commodity data (gratis, tanpa API key)
- **Alpha Vantage API**: Forex data dengan demo key (gratis dengan limit)
- **Exchange Rates API**: Currency exchange rates (gratis, tanpa API key)
- **NewsAPI**: Economic news (gratis dengan API key)
- **Binance Aggregated Trades (WebSocket)**: Sumber volume order flow (hanya pair crypto populer)
>>>>>>> main

### 🏪 **Professional Trading Panels**

#### 📈 **Advanced Chart Panel**
- **TradingView Integration** with 100+ indicators
- **Multi-timeframe Analysis** (1m to 1M)
- **Smart Money Concepts** visualization
- **Support/Resistance** detection
- **Volume Profile** analysis

<<<<<<< HEAD
#### 📋 **Enhanced Watchlist**
- **Dynamic Asset Discovery** across all markets
- **Custom Alerts** with WhatsApp integration  
- **Performance Metrics** and statistics
- **Correlation Analysis** between assets
=======
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Lightweight Charts (TradingView) + Custom Order Flow Heatmap (Tailwind CSS)
- **State Management**: React Hooks
- **Notifications**: React Toastify
- **HTTP Client**: Axios
>>>>>>> main

#### 🧠 **Market Sentiment Dashboard**
- **Fear & Greed Index** tracking
- **Social Media Sentiment** aggregation
- **News Sentiment Analysis** with NLP
- **Institutional vs Retail** positioning

#### 🎯 **Trading Signals Engine**
- **Multi-strategy Signals** with backtesting
- **Confidence Scoring** (1-100%)
- **Risk/Reward Analysis** for each signal
- **Performance Tracking** and analytics

#### 🗞️ **Financial News Center**
- **Real-time News** from major sources
- **Sentiment Classification** (Bullish/Bearish/Neutral)
- **Impact Assessment** on market movements
- **Custom News Filters** by category/source

#### 📅 **Economic Calendar**
- **High-Impact Events** tracking
- **Forecast vs Actual** comparisons
- **Currency Impact** analysis
- **Historical Event** outcomes

#### 🔥 **Market Heatmap**
- **Real-time Performance** visualization
- **Sector Analysis** and rotation
- **Volatility Mapping** across markets
- **Correlation Heatmaps**

#### 📊 **COT Analysis Panel**
- **Commitment of Traders** data
- **Institutional Positioning** analysis
- **Sentiment Divergence** detection
- **Historical COT** patterns

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** 
- **npm 9+**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dhaher-terminal-pro.git
cd dhaher-terminal-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🔧 Configuration

#### API Keys (Optional - All Have Free Tiers)
Create a `.env.local` file for enhanced features:

```env
# Optional API Keys for Enhanced Features
VITE_ALPHA_VANTAGE_KEY=your_free_key_here
VITE_NEWS_API_KEY=your_free_key_here  
VITE_FINNHUB_KEY=your_free_key_here
VITE_TWELVE_DATA_KEY=your_free_key_here
```

**Get Free API Keys:**
- [Alpha Vantage](https://www.alphavantage.co/support/#api-key) - 25 requests/day
- [NewsAPI](https://newsapi.org/register) - 1000 requests/month  
- [Finnhub](https://finnhub.io/register) - 60 calls/minute
- [Twelve Data](https://twelvedata.com/pricing) - 800 calls/day

## 📚 Architecture Overview

### 🏗️ **Technology Stack**

#### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Type-safe development
- **Vite 6** - Ultra-fast build tool
- **Tailwind CSS** - Utility-first styling

#### State Management  
- **Zustand** - Lightweight state management
- **Immer** - Immutable state updates
- **React Query** - Server state management
- **Persistence** - Local storage integration

#### UI Components
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible primitives  
- **Lucide Icons** - Beautiful icon set
- **React Grid Layout** - Draggable panels

#### Data & APIs
- **Axios** - HTTP client with interceptors
- **WebSocket** - Real-time data feeds
- **Chart.js** - Advanced charting
- **TradingView** - Professional charts

### 🔄 **Data Flow Architecture**

<<<<<<< HEAD
=======
### 📈 Institutional Analysis
- COT (Commitment of Traders) data simulation
- Smart Money Concepts analysis
- Retail vs Institutional sentiment
- Market bias detection
- Order Flow Delta analysis untuk mendeteksi imbalance di bid/ask

### 🔍 Market Monitoring
- Real-time watchlist dari API gratis
- Economic calendar integration
- Market sentiment analysis
- Signal generation dan alerts

## Data Sources Detail

### Cryptocurrency (CoinGecko)
>>>>>>> main
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Sources  │───▶│  Data Service   │───▶│  Zustand Store  │
│  (10+ APIs)     │    │  (Aggregation)  │    │  (State Mgmt)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲                       │
                                │                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Cache       │◀───│  Error Handler  │    │  React Components│
│  (5min TTL)     │    │ (Circuit Breaker)│    │   (UI Panels)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛡️ **Reliability Features**

#### **Error Handling**
- **Circuit Breaker Pattern** - Prevents API overload
- **Exponential Backoff** - Smart retry mechanism  
- **Graceful Degradation** - Fallback to cached data
- **User-Friendly Errors** - Clear error messages

#### **Performance Optimization**
- **Smart Caching** - Multi-level caching strategy
- **Rate Limiting** - Respects API limits automatically
- **Lazy Loading** - Components load on demand
- **Code Splitting** - Optimized bundle sizes

#### **Data Integrity**
- **Type Safety** - Full TypeScript coverage
- **Data Validation** - Runtime type checking
- **Fallback Data** - Mock data when APIs fail
- **Consistency** - Cross-component data sync

## 🎨 **UI/UX Features**

### 🎯 **Bloomberg-Style Interface**
- **Professional Dark Theme** with Bloomberg colors
- **Multi-Panel Layout** - Fully customizable workspace
- **Real-time Updates** - Live data streaming
- **Responsive Design** - Works on all screen sizes

### ⚡ **Performance Optimizations**
- **Virtual Scrolling** for large datasets
- **Memoized Components** prevent unnecessary re-renders
- **Optimized Re-renders** with selective subscriptions
- **Bundle Splitting** for faster loading

### 🔄 **Real-time Features**
- **Live Price Updates** every 60 seconds
- **WebSocket Connections** for instant data
- **Push Notifications** for important events
- **Auto-refresh** with configurable intervals

## � **Integrations & Notifications**

### 📲 **WhatsApp Integration**
- **Signal Alerts** - Get trading signals instantly
- **Price Alerts** - Custom price level notifications
- **News Updates** - Important market news
- **Status Updates** - System health notifications

### � **Advanced Notifications**
- **Smart Alerts** - AI-powered significance detection
- **Multi-channel** - Toast, email, WhatsApp support
- **Customizable** - Set your own alert criteria
- **Priority Levels** - High/Medium/Low classifications

## 🧪 **Testing & Quality Assurance**

### 🔬 **Testing Suite**
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

### 📊 **Performance Monitoring**
```bash
# Analyze bundle size
npm run analyze

# Performance profiling
npm run profile

# Lighthouse audit
npm run audit
```

## 🚀 **Deployment Options**

### 🌐 **Recommended Platforms**
- **Vercel** - Zero-config deployment
- **Netlify** - Automated deployments  
- **Railway** - Full-stack hosting
- **AWS Amplify** - Enterprise hosting

### 🐳 **Docker Deployment**
```dockerfile
# Dockerfile included for containerization
docker build -t dhaher-terminal .
docker run -p 3000:3000 dhaher-terminal
```

## 📈 **API Usage & Limits**

<<<<<<< HEAD
### 🆓 **Free Tier Limits**
| Service | Requests | Rate Limit | Features |
|---------|----------|------------|----------|
| CoinGecko | Unlimited | 10-50/min | Crypto data |
| Yahoo Finance | Unlimited | 100/min | Stocks, indices |  
| Exchange Rates | 1500/month | 10/min | Currency data |
| Twelve Data | 800/day | 8/min | Forex, stocks |
| NewsAPI | 1000/month | 100/day | Financial news |
=======
- **Caching**: 5 menit cache untuk mengurangi API calls
- **Lazy Loading**: Panel Order Flow akan memuat data hanya saat dibuka untuk efisiensi
- **Fallback**: Mock data jika semua API gagal
- **Error Handling**: Graceful degradation
- **Loading States**: User-friendly loading indicators
>>>>>>> main

### 🔄 **Automatic Failover**
The system automatically switches between data sources if one becomes unavailable:

```
Primary API → Secondary API → Cached Data → Mock Data
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### 🐛 **Bug Reports**
- Use GitHub Issues with the bug template
- Include steps to reproduce
- Provide browser/OS information

### ✨ **Feature Requests**  
- Use GitHub Issues with the feature template
- Describe the use case and expected behavior
- Consider implementation complexity

### 🔧 **Development Setup**
```bash
# Fork and clone the repo
git clone https://github.com/yourusername/dhaher-terminal-pro.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 **Acknowledgments**

- **Bloomberg Terminal** - UI/UX inspiration
- **TradingView** - Chart integration
- **React Community** - Amazing ecosystem
- **Open Source** - All the amazing libraries we use

## 📞 **Support & Contact**

- 📧 **Email**: support@dhaher.pro
- 💬 **Discord**: [Join our community](https://discord.gg/dhaher)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/dhaher-terminal-pro/issues)
- 📚 **Docs**: [Full Documentation](https://docs.dhaher.pro)

---

<<<<<<< HEAD
**Made with ❤️ by Mulky Malikul Dhaher**  
*Empowering traders with professional-grade tools* 🇮🇩

⭐ **Star this repo** if you find it useful!

---

## 🔮 **Roadmap v2.1**

- 🤖 **AI Trading Bot** integration
- 📊 **Advanced Analytics** dashboard  
- 🔗 **Broker Integration** for live trading
- 📱 **Mobile App** (React Native)
- 🌍 **Multi-language** support
- 🔐 **Advanced Security** features

---

*Last updated: January 2025*
=======
## Pembuat

**Mulky Malikul Dhaher**  
🇮🇩 Indonesia  
📧 [mulkymalikuldhr@mail.com](mailto:mulkymalikuldhr@mail.com)  
🐙 [GitHub](https://github.com/mulkymalikuldhrs)

Dibuat dengan cinta dan dedikasi untuk memberdayakan trader Indonesia dengan tools profesional yang mudah diakses.

---

**Note**: Aplikasi ini menggunakan API gratis yang mungkin memiliki rate limits. Untuk production usage, pertimbangkan upgrade ke paid tiers dari provider API.

## Dukungan

Jika Anda merasa terbantu dengan aplikasi ini, silakan:
- ⭐ Star repository ini
- 🍴 Fork untuk kontribusi
- 🐛 Report bugs melalui GitHub Issues
- 💡 Saran fitur melalui GitHub Discussions

**Made with ❤️ in Indonesia**
>>>>>>> main
