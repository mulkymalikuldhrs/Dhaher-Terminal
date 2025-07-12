# 🖥️ Dhaher Terminal – Full Institutional Web Trading Dashboard (SMC/ICT Powered)

**Nama Proyek**: Dhaher Terminal  
**Kolaborator Branding**: Althaf and Brothers  
**Framework**: Next.js / React  
**Styling**: Tailwind CSS  
**UI Style**: Bloomberg Dark Premium  
**Support**: Mobile & Desktop Responsive  

---

## 🎯 Tujuan

Terminal trading web yang menampilkan data pasar real-time multi-aset dengan analisis otomatis berbasis Smart Money Concepts (SMC) dan ICT. Dilengkapi sinyal otomatis/manual ke WhatsApp dan pop-up notification, serta tampilan data visual (COT, sentiment, liquidity pool).

---

## 📊 Aset Lengkap yang Ditampilkan

### Forex Major Pairs
- EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, NZD/USD
### Forex Cross Pairs
- EUR/GBP, EUR/JPY, EUR/CHF, GBP/JPY, AUD/JPY, NZD/JPY, CHF/JPY, CAD/JPY, AUD/NZD, GBP/AUD, EUR/AUD, GBP/CAD, EUR/CAD
### Exotic Forex
- USD/TRY, USD/SGD, USD/ZAR, USD/MXN, EUR/TRY
### Commodities
- XAU/USD, XAG/USD, WTI, Brent, Copper (HG), Platinum (XPT/USD), Natural Gas, Palladium
### Indices
- NASDAQ (NQ), S&P500 (ES), Dow Jones (YM), DAX, Nikkei 225, FTSE 100, CAC 40, Euro Stoxx 50, ASX 200, Hang Seng
### Cryptocurrency
- BTC/USD, ETH/USD, BNB/USD, SOL/USD, XRP/USD, DOGE/USD, ADA/USD, DOT/USD, AVAX/USD

---

## 🔌 API & Integrasi

| Data               | API / Sumber                                      |
|--------------------|---------------------------------------------------|
| Real-time Price    | TwelveData / Polygon.io                           |
| Retail Sentiment   | MyFxBook / FXSSI                                  |
| COT Net Position   | FinancialModelingPrep                             |
| Chart Interaktif   | TradingView Embed                                 |
| Timezone Support   | WorldTimeAPI (NY & WIB)                           |
| WhatsApp Sinyal    | WhatsApp Cloud API / Twilio                       |
| Pop-up Notification| react-toastify, serviceWorker push                |
| Liquidity & Heatmap| Bookmap-style custom panel (Data provider needed) |

---

## 🧠 Strategi Analisis SMC & ICT

- **Market Structure**: BOS / CHoCH / Sweep / SH-SL
- **POI Identification**: OB, FVG, BB, Liquidity & Inducement Zone
- **SMT Divergence**: Korelasi langsung & terbalik antar aset
- **AMD Narrative**: Asia (A), London (M), New York (D)
- **Killzone Map**: Overlay Asia/London/NY dengan dual clock
- **Entry Logic**: Sweep → BOS → OB di M15/M5

---

## 🧩 Komponen UI Terminal

- Multi-tab navigasi semua aset
- Panel interaktif drag-and-drop
- Chart + info box (sentiment, POI, COT chart, SMT, struktur)
- Visual sinyal: 🔴 | 🟡 | 🟢
- Sidebar login opsional: simpan watchlist & analisis
- Heatmap & Liquidity Zones ala Bookmap
- Push notification (in-app)
- WhatsApp Auto Signal Push
- Bahasa: 🇮🇩 Indonesia & 🇺🇸 English

---

## 💬 Contoh Sinyal Otomatis

> **BTC/USD — Bias: Bullish**  
Retail: 67% Short | COT: Net Long  
Structure: Sweep + BOS + OB H1 @ 63500  
SMT: Divergen dengan ETH/USD  
✅ 🟢 Full Confluence → WhatsApp Notification Sent

---

## 📦 Stack Teknologi

- **Frontend**: Next.js / React + Tailwind CSS  
- **Chart Embed**: TradingView  
- **Backend Opsional**: Node.js / Firebase / Supabase  
- **Realtime**: WebSocket atau Polling API  
- **Notif**: Web Push + WhatsApp  
- **Multibahasa**: i18next (EN + ID)  
- **Dokumentasi**: Komponen modular & scalable

---

## 🚀 Tujuan Akhir

Membangun **Dhaher Terminal** sebagai terminal institusi modern berbasis web, lengkap dengan analisa posisi ritel & institusi, smart signal otomatis, heatmap, liquidity insight, dan navigasi visual seperti Bloomberg — untuk profesional yang disiplin pada struktur pasar, bukan noise.

---

> Versi: 2025-06-24
