
# Dhaher Terminal - Bloomberg-Style Trading Dashboard

Professional trading terminal dengan interface Bloomberg-style untuk analisis pasar real-time menggunakan API publik gratis.

**Dibuat oleh [Mulky Malikul Dhaher](mailto:mulkymalikuldhr@mail.com) di Indonesia dengan ❤️**

> "Democratizing professional trading tools for everyone"

## Fitur Utama

### 📊 Real-Time Market Data
- Multi-asset trading dashboard (Forex, Crypto, Commodities, Indices)
- Chart candlestick dengan timeframe multiple (1m, 5m, 15m, 1h, 4h, 1d)
- Data harga real-time dari API publik gratis

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

## Sumber Data Real-Time

### API Gratis yang Digunakan
- **CoinGecko API**: Cryptocurrency market data (gratis, tanpa API key)
- **Yahoo Finance API**: Stock indices dan commodity data (gratis, tanpa API key)
- **Alpha Vantage API**: Forex data dengan demo key (gratis dengan limit)
- **Exchange Rates API**: Currency exchange rates (gratis, tanpa API key)
- **NewsAPI**: Economic news (gratis dengan API key)

### Reliabilitas Data
Aplikasi menggunakan strategi multi-tier:
1. **API Publik Gratis** - Primary source untuk data real-time
2. **Cache Layer** - Menyimpan data untuk mengurangi API calls
3. **Mock Data Fallback** - Backup jika API tidak tersedia

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

### API Keys (Opsional)
Beberapa API memerlukan key untuk akses penuh:
- `Alpha Vantage`: Daftar gratis di alphavantage.co
- `NewsAPI`: Daftar gratis di newsapi.org
- `Finnhub`: Daftar gratis di finnhub.io

Update di `src/services/apiConfig.ts`:
```typescript
export const API_KEYS = {
  ALPHA_VANTAGE: "YOUR_FREE_KEY",
  NEWS_API: "YOUR_FREE_KEY",
  FINNHUB: "YOUR_FREE_KEY"
};
```

## API Limits & Usage

### CoinGecko (Cryptocurrency)
- ✅ Gratis tanpa API key
- ✅ 10-50 calls per minute
- ✅ Market data untuk 10+ crypto teratas

### Yahoo Finance (Indices & Commodities)  
- ✅ Gratis tanpa API key
- ✅ Tidak ada limit resmi
- ✅ Data S&P 500, NASDAQ, Gold, Oil, dll

### Alpha Vantage (Forex)
- ✅ Gratis dengan demo key
- ⚠️ 5 calls per minute dengan free tier
- ✅ Major forex pairs

### Exchange Rates API (Currency)
- ✅ Gratis tanpa API key
- ✅ 1000 requests per month
- ✅ Real-time exchange rates

## Features

### 🖥️ Bloomberg-Style Interface
- Dark theme dengan color scheme profesional
- Multi-panel grid layout yang dapat dikustomisasi
- Real-time data streaming dari API publik
- Professional market data visualization

### 📊 Chart Analysis
- Candlestick charts dengan zoom dan pan
- Multiple timeframes
- Technical analysis indicators
- Market structure visualization

### 📈 Institutional Analysis
- COT (Commitment of Traders) data simulation
- Smart Money Concepts analysis
- Retail vs Institutional sentiment
- Market bias detection

### 🔍 Market Monitoring
- Real-time watchlist dari API gratis
- Economic calendar integration
- Market sentiment analysis
- Signal generation dan alerts

## Data Sources Detail

### Cryptocurrency (CoinGecko)
```
Endpoint: /coins/markets
Limit: Gratis, 10-50 calls/minute
Data: Price, volume, 24h change, market cap
Coverage: Top 100+ cryptocurrencies
```

### Stock Indices (Yahoo Finance)
```
Endpoint: /chart/{symbol}
Limit: Tidak terbatas (unofficial)
Data: OHLCV, real-time prices
Coverage: S&P 500, NASDAQ, Dow Jones, dll
```

### Commodities (Yahoo Finance)
```
Symbols: GC=F (Gold), SI=F (Silver), CL=F (Oil)
Data: Real-time commodity prices
Update: Setiap menit selama jam trading
```

### Forex (Alpha Vantage + Exchange Rates)
```
Alpha Vantage: Major pairs dengan demo key
Exchange Rates API: Current exchange rates
Update: Real-time (dengan cache 5 menit)
```

## Performance & Optimization

- **Caching**: 5 menit cache untuk mengurangi API calls
- **Fallback**: Mock data jika semua API gagal
- **Error Handling**: Graceful degradation
- **Loading States**: User-friendly loading indicators

## Deployment

Aplikasi siap deploy di Replit tanpa konfigurasi tambahan. Semua API yang digunakan adalah publik dan gratis.

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## License

MIT License - lihat file LICENSE untuk detail.

---

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
