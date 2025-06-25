
# Dhaher Terminal - Bloomberg-Style Trading Dashboard

Professional trading terminal dengan interface Bloomberg-style untuk analisis pasar real-time.

## Fitur Utama

### 📊 Real-Time Market Data
- Multi-asset trading dashboard (Forex, Crypto, Commodities, Indices)
- Chart candlestick dengan timeframe multiple (1m, 5m, 15m, 1h, 4h, 1d)
- Data harga real-time dengan fallback ke mock data untuk reliability

### 📈 Analisis Profesional
- COT (Commitment of Traders) analysis
- Smart Money Concepts (SMC) analysis
- Market structure analysis dengan bias detection
- Economic calendar integration

### 🔔 Smart Notifications
- Real-time price alerts
- Signal notifications
- Market sentiment alerts
- Economic news notifications

### 🎯 Trading Tools
- Retail sentiment tracking
- Institutional positioning analysis
- Market heatmap visualization
- Multi-panel workspace seperti Bloomberg Terminal

## Sumber Data

### Primary Data Sources
- **Mock Data**: Digunakan sebagai sumber utama untuk reliability dan consistency
- **FCSAPI**: Real-time forex, commodities, dan crypto data
- **CoinGecko**: Cryptocurrency market data
- **Yahoo Finance**: Stock indices dan commodity data
- **Alpha Vantage**: Forex historical data

### Chart Data Strategy
Aplikasi menggunakan strategi multi-tier untuk chart data:
1. **Mock Data** - Primary source untuk chart rendering yang stabil
2. **API Fallback** - Secondary source dari berbagai financial APIs
3. **Generated Fallback** - Synthetic data jika semua source gagal

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Lightweight Charts (TradingView)
- **State Management**: React Hooks
- **Notifications**: React Toastify
- **HTTP Client**: Axios

## Installation

```bash
npm install
npm run dev
```

## Development

Server akan berjalan di `http://localhost:5173/`

### Environment Variables
Untuk menggunakan live data APIs, set environment variables:
- `VITE_FCSAPI_KEY` - FCSAPI access key
- `VITE_ALPHA_VANTAGE_KEY` - Alpha Vantage API key

## Features

### 🖥️ Bloomberg-Style Interface
- Dark theme dengan color scheme profesional
- Multi-panel grid layout yang dapat dikustomisasi
- Real-time data streaming
- Professional market data visualization

### 📊 Chart Analysis
- Candlestick charts dengan zoom dan pan
- Multiple timeframes
- Technical analysis indicators
- Market structure visualization

### 📈 Institutional Analysis
- COT (Commitment of Traders) data
- Smart Money Concepts analysis
- Retail vs Institutional sentiment
- Market bias detection

### 🔍 Market Monitoring
- Real-time watchlist
- Economic calendar
- Market sentiment analysis
- Signal generation dan alerts

## API Integration

### Supported APIs
- **FCSAPI**: Forex, commodities, crypto real-time data
- **CoinGecko**: Cryptocurrency market data
- **Yahoo Finance**: Stock indices dan commodities
- **Alpha Vantage**: Forex historical data

### Fallback Strategy
Jika API external gagal, aplikasi akan:
1. Menggunakan cached data jika tersedia
2. Fallback ke mock data yang reliable
3. Generate synthetic data sebagai last resort

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## License

MIT License - Lihat file LICENSE untuk detail lengkap.

---

**Dhaher Terminal** - Professional trading analysis platform dengan Bloomberg-style interface untuk trader dan investor profesional.
