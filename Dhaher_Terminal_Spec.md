# 🖥️ Dhaher Terminal – Institutional Web Trading Dashboard (SMC/ICT Powered)

**Nama Proyek**: Dhaher Terminal  
**Kolaborator Branding**: Althaf and Brothers (gaya & fitur menyerupai terminal institusi seperti Bloomberg)  
**Framework**: Next.js / React  
**Styling**: Tailwind CSS  
**Mode UI**: Dark Mode Premium (Bloomberg-style)  
**Responsif**: Mobile & Desktop  

---

## 🎯 Tujuan Website

Membangun terminal trading real-time yang menampilkan data multi-aset (Forex, Komoditas, Indeks Global, Crypto), lengkap dengan **analisis otomatis berbasis strategi Smart Money Concepts (SMC)** dan **ICT**, serta fitur notifikasi pop-up dan sinyal otomatis/manual ke **WhatsApp**.

---

## 📊 Aset yang Ditampilkan

### Forex Major Pairs
- EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, NZD/USD

### Commodities
- XAU/USD (Gold), XAG/USD (Silver), WTI, Brent

### Indices
- NASDAQ, S&P500, Dow Jones, DAX, Nikkei

### Cryptocurrency
- BTC/USD, ETH/USD

---

## 🔌 API & Integrasi

| Data               | API / Sumber                                      |
|--------------------|---------------------------------------------------|
| Real-time Price    | TwelveData / Polygon.io                           |
| Retail Sentiment   | MyFxBook / FXSSI                                  |
| COT Net Position   | FinancialModelingPrep (dengan visual chart)       |
| Chart Interaktif   | TradingView Widget                                |
| Dual Timezone      | WorldTimeAPI (NY & WIB)                           |
| WhatsApp Sinyal    | WhatsApp Cloud API / Twilio                       |
| Notifikasi Pop-up  | react-toastify atau custom modal                  |

---

## 🧠 Fitur Analisa SMC & ICT

- **Structure Detection**: BOS / CHoCH / Sweep / SH-SL
- **POI Detection**: OB, FVG, BB, inducement zones
- **SMT Divergence**: Korelasi antar aset (langsung & terbalik)
- **AMD Narrative**: Asia = Akumulasi, London = Manipulasi, NY = Distribusi
- **Killzone Visual**: Overlay Asia / London / New York session
- **Entry Setup**: M15/M5 Sweep → BOS → OB
- **Checklist Konfluensi**:
  - HTF Bias jelas
  - POI valid (premium/discount)
  - SMT confirmed
  - Struktur valid
  - AMD cocok

---

## 🧩 Komponen UI (Seperti Bloomberg Terminal)

- Tab navigasi per aset
- Panel interaktif (drag & drop)
- Live TradingView chart + info panel:
  - Retail sentiment
  - COT posisi institusi (chart)
  - POI terdekat
- Watchlist & analisis pribadi
- Status sinyal visual: 🔴 / 🟡 / 🟢
- Sidebar: login opsional
- Killzone: overlay & jam NY + WIB
- Heatmap dan Bookmap-style liquidity zones

---

## 🔔 Notifikasi Pop-up & WhatsApp

### Bahasa Indonesia:
🔔 Sinyal Baru EUR/USD – Bias: Bullish  
Retail: 75% Short | COT: Net Long  
Structure: BOS + OB H1 @ 1.07320  
✅ Konfluensi Lengkap

### English:
🔔 New Signal EUR/USD – Bias: Bullish  
Retail: 75% Short | COT: Net Long  
Structure: BOS + OB H1 @ 1.07320  
✅ Full Confluence

---

## 📦 Teknologi & Output

- **Frontend**: Next.js atau React + Tailwind CSS  
- **Chart**: TradingView Embed  
- **Backend Opsional**: Node.js, Firebase, atau Express.js  
- **Realtime Fetch**: REST API / WebSocket  
- **Multibahasa**: i18next untuk English + Indonesia  
- **Notifikasi WA & Web**: WhatsApp Cloud API, in-app popup  
- **Dokumentasi Developer**: Reusable component & scalable logic

---

## 🚀 Tujuan Akhir

Membangun **Dhaher Terminal** sebagai pusat kendali trading profesional berbasis logika SMC/ICT:  
- Lihat posisi institusi vs ritel  
- Identifikasi struktur & likuiditas  
- Sinyal dengan konfluensi tinggi  
- Notifikasi langsung ke WhatsApp & perangkat  
- Tanpa VPS, langsung dari browser

---

## 🛠️ Langkah Selanjutnya

- [ ] Setup project Next.js / React + Tailwind CSS  
- [ ] Buat sistem navigasi & layout dashboard  
- [ ] Integrasikan API real-time  
- [ ] Tambahkan engine logika analisa SMC/ICT  
- [ ] Implementasi chart, heatmap, dan COT visual  
- [ ] Konfigurasi sistem notifikasi (WA + pop-up)  
- [ ] Dokumentasi lengkap & siap di-scale

---

> Versi: 2025-06-24
