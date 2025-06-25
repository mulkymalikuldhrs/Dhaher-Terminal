import { useState, useEffect } from 'react';
import { Asset, AssetCategory } from '../types';
import { fetchAssets, fetchChartData, fetchSignals, fetchMarketSentiment } from '../services/dataService';
import { toast } from 'react-toastify';

export const useMarketData = (category: AssetCategory | 'all' = 'all') => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assets based on category
  useEffect(() => {
    const getAssets = async () => {
      setLoading(true);
      try {
        const data = await fetchAssets(category);
        setAssets(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data');
        toast.error('Failed to load market data: ' + (err.response?.data?.['Error Message'] || 'API error. Please check console.'));
        
        // Try to load from mock data as fallback
        try {
          const { mockAssets } = await import('../data/mockData');
          if (category === 'all') {
            setAssets(mockAssets);
          } else {
            setAssets(mockAssets.filter(asset => asset.category === category));
          }
          toast.info('Using cached market data');
        } catch (fallbackErr) {
          console.error('Error loading fallback data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    getAssets();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      getAssets();
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [category]);

  return { assets, loading, error };
};

export const useChartData = (assetId: string, timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1d') => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getChartData = async () => {
      if (!assetId) return;
      
      setLoading(true);
      try {
        const data = await fetchChartData(assetId, timeframe);
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to fetch chart data');
        
        // Try to load from mock data as fallback
        try {
          const { getAssetChartData } = await import('../data/mockData');
          const isIntraday = timeframe !== '1d';
          const mockData = getAssetChartData(assetId, isIntraday ? 'intraday' : 'daily');
          setChartData(mockData);
          toast.info('Using cached chart data');
        } catch (fallbackErr) {
          console.error('Error loading fallback chart data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    getChartData();
    
    // For shorter timeframes, update more frequently
    const intervalTime = 
      timeframe === '1m' ? 15000 : // 15 seconds
      timeframe === '5m' ? 30000 : // 30 seconds
      timeframe === '15m' ? 60000 : // 1 minute
      300000; // 5 minutes for longer timeframes
    
    const intervalId = setInterval(() => {
      getChartData();
    }, intervalTime);
    
    return () => clearInterval(intervalId);
  }, [assetId, timeframe]);

  return { chartData, loading, error };
};

export const useSignals = () => {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSignals = async () => {
      setLoading(true);
      try {
        const data = await fetchSignals();
        setSignals(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching signals:', err);
        setError('Failed to fetch trading signals');
        
        // Load from mock data as fallback
        try {
          const { mockAssets } = await import('../data/mockData');
          const mockSignals: any[] = [];
          
          mockAssets.forEach(asset => {
            if (asset.signals) {
              asset.signals.forEach((signal: any) => {
                mockSignals.push({
                  ...signal,
                  asset
                });
              });
            }
          });
          
          setSignals(mockSignals);
        } catch (fallbackErr) {
          console.error('Error loading fallback signals:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    getSignals();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      getSignals();
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return { signals, loading, error };
};

export const useSentiment = () => {
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSentiment = async () => {
      setLoading(true);
      try {
        const data = await fetchMarketSentiment();
        setSentiment(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching market sentiment:', err);
        setError('Failed to fetch market sentiment data');
        
        // Load from mock data as fallback
        try {
          const { mockAssets } = await import('../data/mockData');
          
          const totalLong = mockAssets.reduce((sum, asset) => sum + asset.retailSentiment.long, 0);
          const totalShort = mockAssets.reduce((sum, asset) => sum + asset.retailSentiment.short, 0);
          
          setSentiment({
            averageSentiment: {
              long: Math.round(totalLong / mockAssets.length),
              short: Math.round(totalShort / mockAssets.length)
            },
            mostBullish: mockAssets.sort((a, b) => b.retailSentiment.long - a.retailSentiment.long)[0],
            mostBearish: mockAssets.sort((a, b) => b.retailSentiment.short - a.retailSentiment.short)[0],
            extremeSentiment: mockAssets.filter(
              asset => asset.retailSentiment.long > 70 || asset.retailSentiment.short > 70
            )
          });
        } catch (fallbackErr) {
          console.error('Error loading fallback sentiment data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    getSentiment();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      getSentiment();
    }, 300000); // Update every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  return { sentiment, loading, error };
};
