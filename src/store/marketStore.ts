// Enhanced Market Store for Dhaher Terminal Pro v2.0
// Comprehensive state management with Zustand

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { 
  MarketData, 
  NewsItem, 
  EconomicEvent, 
  SentimentData, 
  OHLCData,
  dataService 
} from '../services/dataService';

// Enhanced types for store state
export interface MarketStoreState {
  // Market data
  cryptoData: MarketData[];
  forexData: MarketData[];
  indicesData: MarketData[];
  commoditiesData: MarketData[];
  
  // Chart data
  chartData: Record<string, OHLCData[]>;
  selectedSymbol: string | null;
  selectedTimeframe: string;
  
  // News and events
  news: NewsItem[];
  economicEvents: EconomicEvent[];
  
  // Sentiment data
  sentiment: SentimentData[];
  
  // UI state
  isLoading: boolean;
  isConnected: boolean;
  lastUpdate: number;
  errors: Record<string, string>;
  
  // Panel states
  panels: {
    watchlist: { symbols: string[]; sortBy: string };
    chart: { indicators: string[]; overlays: string[] };
    news: { filters: string[]; sources: string[] };
    sentiment: { timeframe: string; symbols: string[] };
    heatmap: { category: string; metric: string };
    calendar: { countries: string[]; impacts: string[] };
  };
  
  // Trading signals
  signals: Array<{
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    strength: 'weak' | 'medium' | 'strong';
    timestamp: number;
    price: number;
    reason: string;
    confidence: number;
  }>;
  
  // Real-time updates
  liveUpdates: boolean;
  updateInterval: number;
  
  // WebSocket connections
  websocketConnections: Record<string, WebSocket>;
}

export interface MarketStoreActions {
  // Data fetching actions
  fetchAllMarketData: () => Promise<void>;
  fetchCryptoData: (symbols?: string[]) => Promise<void>;
  fetchForexData: (pairs?: string[]) => Promise<void>;
  fetchIndicesData: (symbols?: string[]) => Promise<void>;
  fetchCommoditiesData: (commodities?: string[]) => Promise<void>;
  fetchChartData: (symbol: string, timeframe?: string) => Promise<void>;
  fetchNews: (query?: string, limit?: number) => Promise<void>;
  fetchEconomicEvents: (days?: number) => Promise<void>;
  fetchSentimentData: (symbols?: string[]) => Promise<void>;
  
  // UI actions
  setSelectedSymbol: (symbol: string | null) => void;
  setSelectedTimeframe: (timeframe: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  
  // Panel actions
  updateWatchlist: (symbols: string[]) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  updateChartIndicators: (indicators: string[]) => void;
  updateNewsFilters: (filters: string[]) => void;
  updateSentimentTimeframe: (timeframe: string) => void;
  
  // Real-time actions
  startLiveUpdates: () => void;
  stopLiveUpdates: () => void;
  connectWebSocket: (symbol: string, endpoint: string) => void;
  disconnectWebSocket: (symbol: string) => void;
  disconnectAllWebSockets: () => void;
  
  // Signal actions
  generateSignals: () => void;
  addSignal: (signal: any) => void;
  removeSignal: (signalId: string) => void;
  
  // Cache and performance
  clearCache: () => void;
  resetStore: () => void;
}

type MarketStore = MarketStoreState & MarketStoreActions;

// Initial state
const initialState: MarketStoreState = {
  cryptoData: [],
  forexData: [],
  indicesData: [],
  commoditiesData: [],
  chartData: {},
  selectedSymbol: null,
  selectedTimeframe: '1h',
  news: [],
  economicEvents: [],
  sentiment: [],
  isLoading: false,
  isConnected: true,
  lastUpdate: 0,
  errors: {},
  panels: {
    watchlist: { symbols: ['BTC', 'ETH', 'EUR/USD', 'SPX'], sortBy: 'price' },
    chart: { indicators: ['MA', 'RSI'], overlays: ['volume'] },
    news: { filters: ['finance', 'crypto'], sources: [] },
    sentiment: { timeframe: '1d', symbols: ['BTC', 'ETH'] },
    heatmap: { category: 'crypto', metric: 'changePercent' },
    calendar: { countries: ['US', 'EU'], impacts: ['high', 'medium'] }
  },
  signals: [],
  liveUpdates: false,
  updateInterval: 60000, // 1 minute
  websocketConnections: {}
};

// Create the store with enhanced middleware
export const useMarketStore = create<MarketStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // Data fetching actions
        fetchAllMarketData: async () => {
          set((state) => {
            state.isLoading = true;
            state.errors = {};
          });

          try {
            await Promise.allSettled([
              get().fetchCryptoData(),
              get().fetchForexData(),
              get().fetchIndicesData(),
              get().fetchCommoditiesData(),
              get().fetchNews(),
              get().fetchEconomicEvents(),
              get().fetchSentimentData()
            ]);

            set((state) => {
              state.lastUpdate = Date.now();
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.isLoading = false;
              state.errors.general = 'Failed to fetch market data';
            });
          }
        },

        fetchCryptoData: async (symbols = ['bitcoin', 'ethereum', 'cardano', 'solana', 'chainlink']) => {
          try {
            const data = await dataService.getCryptoData(symbols);
            set((state) => {
              state.cryptoData = data;
              delete state.errors.crypto;
            });
          } catch (error) {
            set((state) => {
              state.errors.crypto = 'Failed to fetch crypto data';
            });
          }
        },

        fetchForexData: async (pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD']) => {
          try {
            const data = await dataService.getForexData(pairs);
            set((state) => {
              state.forexData = data;
              delete state.errors.forex;
            });
          } catch (error) {
            set((state) => {
              state.errors.forex = 'Failed to fetch forex data';
            });
          }
        },

        fetchIndicesData: async (symbols = ['SPX', 'NASDAQ', 'DOW', 'FTSE']) => {
          try {
            const data = await dataService.getIndicesData(symbols);
            set((state) => {
              state.indicesData = data;
              delete state.errors.indices;
            });
          } catch (error) {
            set((state) => {
              state.errors.indices = 'Failed to fetch indices data';
            });
          }
        },

        fetchCommoditiesData: async (commodities = ['GOLD', 'SILVER', 'OIL', 'NATURAL_GAS']) => {
          try {
            const data = await dataService.getCommoditiesData(commodities);
            set((state) => {
              state.commoditiesData = data;
              delete state.errors.commodities;
            });
          } catch (error) {
            set((state) => {
              state.errors.commodities = 'Failed to fetch commodities data';
            });
          }
        },

        fetchChartData: async (symbol: string, timeframe = '1h') => {
          try {
            const data = await dataService.getHistoricalData(symbol, timeframe);
            set((state) => {
              state.chartData[`${symbol}_${timeframe}`] = data;
              delete state.errors.chart;
            });
          } catch (error) {
            set((state) => {
              state.errors.chart = `Failed to fetch chart data for ${symbol}`;
            });
          }
        },

        fetchNews: async (query = 'finance', limit = 50) => {
          try {
            const data = await dataService.getMarketNews(query, limit);
            set((state) => {
              state.news = data;
              delete state.errors.news;
            });
          } catch (error) {
            set((state) => {
              state.errors.news = 'Failed to fetch news data';
            });
          }
        },

        fetchEconomicEvents: async (days = 7) => {
          try {
            const data = await dataService.getEconomicEvents(days);
            set((state) => {
              state.economicEvents = data;
              delete state.errors.calendar;
            });
          } catch (error) {
            set((state) => {
              state.errors.calendar = 'Failed to fetch economic events';
            });
          }
        },

        fetchSentimentData: async (symbols = ['BTC', 'ETH', 'EUR/USD', 'SPX']) => {
          try {
            const data = await dataService.getSentimentData(symbols);
            set((state) => {
              state.sentiment = data;
              delete state.errors.sentiment;
            });
          } catch (error) {
            set((state) => {
              state.errors.sentiment = 'Failed to fetch sentiment data';
            });
          }
        },

        // UI actions
        setSelectedSymbol: (symbol) => {
          set((state) => {
            state.selectedSymbol = symbol;
          });
          
          if (symbol) {
            get().fetchChartData(symbol, get().selectedTimeframe);
          }
        },

        setSelectedTimeframe: (timeframe) => {
          set((state) => {
            state.selectedTimeframe = timeframe;
          });
          
          const symbol = get().selectedSymbol;
          if (symbol) {
            get().fetchChartData(symbol, timeframe);
          }
        },

        setLoading: (loading) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setError: (key, error) => {
          set((state) => {
            state.errors[key] = error;
          });
        },

        clearError: (key) => {
          set((state) => {
            delete state.errors[key];
          });
        },

        clearAllErrors: () => {
          set((state) => {
            state.errors = {};
          });
        },

        // Panel actions
        updateWatchlist: (symbols) => {
          set((state) => {
            state.panels.watchlist.symbols = symbols;
          });
        },

        addToWatchlist: (symbol) => {
          set((state) => {
            if (!state.panels.watchlist.symbols.includes(symbol)) {
              state.panels.watchlist.symbols.push(symbol);
            }
          });
        },

        removeFromWatchlist: (symbol) => {
          set((state) => {
            state.panels.watchlist.symbols = state.panels.watchlist.symbols.filter(s => s !== symbol);
          });
        },

        updateChartIndicators: (indicators) => {
          set((state) => {
            state.panels.chart.indicators = indicators;
          });
        },

        updateNewsFilters: (filters) => {
          set((state) => {
            state.panels.news.filters = filters;
          });
        },

        updateSentimentTimeframe: (timeframe) => {
          set((state) => {
            state.panels.sentiment.timeframe = timeframe;
          });
        },

        // Real-time actions
        startLiveUpdates: () => {
          set((state) => {
            state.liveUpdates = true;
          });

          // Set up automatic data refresh
          const intervalId = setInterval(() => {
            if (get().liveUpdates) {
              get().fetchAllMarketData();
            }
          }, get().updateInterval);

          // Store interval ID for cleanup
          set((state) => {
            state.websocketConnections.updateInterval = intervalId as any;
          });
        },

        stopLiveUpdates: () => {
          set((state) => {
            state.liveUpdates = false;
          });

          // Clear update interval
          const intervalId = get().websocketConnections.updateInterval;
          if (intervalId) {
            clearInterval(intervalId as any);
          }
        },

        connectWebSocket: (symbol, endpoint) => {
          try {
            const ws = new WebSocket(endpoint);
            
            ws.onopen = () => {
              console.log(`WebSocket connected for ${symbol}`);
              set((state) => {
                state.isConnected = true;
              });
            };

            ws.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                // Handle real-time data updates
                console.log(`Real-time data for ${symbol}:`, data);
              } catch (error) {
                console.error('Error parsing WebSocket data:', error);
              }
            };

            ws.onerror = (error) => {
              console.error(`WebSocket error for ${symbol}:`, error);
              set((state) => {
                state.errors.websocket = `WebSocket error for ${symbol}`;
              });
            };

            ws.onclose = () => {
              console.log(`WebSocket disconnected for ${symbol}`);
              set((state) => {
                delete state.websocketConnections[symbol];
              });
            };

            set((state) => {
              state.websocketConnections[symbol] = ws;
            });
          } catch (error) {
            set((state) => {
              state.errors.websocket = `Failed to connect WebSocket for ${symbol}`;
            });
          }
        },

        disconnectWebSocket: (symbol) => {
          const ws = get().websocketConnections[symbol];
          if (ws) {
            ws.close();
            set((state) => {
              delete state.websocketConnections[symbol];
            });
          }
        },

        disconnectAllWebSockets: () => {
          const connections = get().websocketConnections;
          Object.values(connections).forEach((ws: any) => {
            if (ws && ws.close) {
              ws.close();
            }
          });
          
          set((state) => {
            state.websocketConnections = {};
            state.liveUpdates = false;
          });
        },

        // Signal actions
        generateSignals: () => {
          const allData = [
            ...get().cryptoData,
            ...get().forexData,
            ...get().indicesData,
            ...get().commoditiesData
          ];

          const signals = allData
            .filter(item => Math.abs(item.changePercent) > 2) // Significant moves
            .map(item => ({
              id: `signal_${Date.now()}_${item.symbol}`,
              symbol: item.symbol,
              type: item.changePercent > 0 ? 'buy' : 'sell' as 'buy' | 'sell',
              strength: Math.abs(item.changePercent) > 5 ? 'strong' : 'medium' as 'weak' | 'medium' | 'strong',
              timestamp: Date.now(),
              price: item.price,
              reason: item.changePercent > 0 
                ? `Strong bullish momentum (+${item.changePercent.toFixed(2)}%)`
                : `Significant bearish move (${item.changePercent.toFixed(2)}%)`,
              confidence: Math.min(95, 50 + Math.abs(item.changePercent) * 5)
            }));

          set((state) => {
            state.signals = signals;
          });
        },

        addSignal: (signal) => {
          set((state) => {
            state.signals.push(signal);
          });
        },

        removeSignal: (signalId) => {
          set((state) => {
            state.signals = state.signals.filter(s => s.id !== signalId);
          });
        },

        // Cache and performance
        clearCache: () => {
          dataService.clearCache();
          set((state) => {
            state.chartData = {};
            state.lastUpdate = 0;
          });
        },

        resetStore: () => {
          get().disconnectAllWebSockets();
          get().clearCache();
          set(initialState);
        }
      }))
    ),
    {
      name: 'dhaher-terminal-store',
    }
  )
);

// Selector hooks for better performance
export const useCryptoData = () => useMarketStore(state => state.cryptoData);
export const useForexData = () => useMarketStore(state => state.forexData);
export const useIndicesData = () => useMarketStore(state => state.indicesData);
export const useCommoditiesData = () => useMarketStore(state => state.commoditiesData);
export const useChartData = () => useMarketStore(state => state.chartData);
export const useSelectedSymbol = () => useMarketStore(state => state.selectedSymbol);
export const useSelectedTimeframe = () => useMarketStore(state => state.selectedTimeframe);
export const useNews = () => useMarketStore(state => state.news);
export const useEconomicEvents = () => useMarketStore(state => state.economicEvents);
export const useSentiment = () => useMarketStore(state => state.sentiment);
export const useSignals = () => useMarketStore(state => state.signals);
export const useIsLoading = () => useMarketStore(state => state.isLoading);
export const useErrors = () => useMarketStore(state => state.errors);
export const useIsConnected = () => useMarketStore(state => state.isConnected);
export const usePanels = () => useMarketStore(state => state.panels);

// Actions hooks
export const useMarketActions = () => useMarketStore(state => ({
  fetchAllMarketData: state.fetchAllMarketData,
  fetchCryptoData: state.fetchCryptoData,
  fetchForexData: state.fetchForexData,
  fetchIndicesData: state.fetchIndicesData,
  fetchCommoditiesData: state.fetchCommoditiesData,
  fetchChartData: state.fetchChartData,
  fetchNews: state.fetchNews,
  fetchEconomicEvents: state.fetchEconomicEvents,
  fetchSentimentData: state.fetchSentimentData,
  setSelectedSymbol: state.setSelectedSymbol,
  setSelectedTimeframe: state.setSelectedTimeframe,
  generateSignals: state.generateSignals,
  startLiveUpdates: state.startLiveUpdates,
  stopLiveUpdates: state.stopLiveUpdates,
  clearCache: state.clearCache,
  resetStore: state.resetStore
}));