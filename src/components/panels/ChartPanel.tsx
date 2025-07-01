// @ts-nocheck

import { useEffect, useRef, useState } from 'react';
import { Asset, PanelProps } from '../../types';
import { 
  createChart, 
  ColorType, 
  IChartApi,
  UTCTimestamp,
  CandlestickSeriesPartialOptions,
  SeriesType
} from 'lightweight-charts';
import { useChartData } from '../../hooks/useMarketData';
import { Clock, Maximize2, Minimize2, RefreshCw, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { toast } from 'react-toastify';
import { analyzeSMC } from '../../services/institutionalDataService';

export default function ChartPanel({ panel, assets }: PanelProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<any | null>(null);
  const [asset, setAsset] = useState<Asset | undefined>(undefined);
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('1d');
  const [fullscreen, setFullscreen] = useState(false);
  const [smcAnalysis, setSMCAnalysis] = useState<any>(null);
  const [showSMC, setShowSMC] = useState(true);
  const { chartData, loading, error } = useChartData(panel.assetId || '', timeframe);

  // Find and set the asset based on the panel's assetId
  useEffect(() => {
    if (!panel.assetId) return;
    
    const foundAsset = assets.find(a => a.id === panel.assetId);
    if (foundAsset) {
      setAsset(foundAsset);
    }
  }, [panel.assetId, assets]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clean up any existing chart instance
    if (chartInstance) {
      chartInstance.remove();
    }
    
    const handleResize = () => {
      if (chartContainerRef.current && chartInstance) {
        chartInstance.resize(
          chartContainerRef.current.clientWidth, 
          chartContainerRef.current.clientHeight - 40
        );
      }
    };

    try {
      // Create chart with proper configuration
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight - 40,
        layout: {
          background: { type: ColorType.Solid, color: '#1E2130' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        crosshair: {
          mode: 1, // CrosshairMode.Normal
        },
        timeScale: {
          borderColor: '#2B2B43',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#2B2B43',
          autoScale: true,
        },
      });
      
      setChartInstance(chart);

      // Create and add candlestick series - fixed implementation
      try {
        // Define candlestick series options
        const candlestickOptions: CandlestickSeriesPartialOptions = {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        };
        
        // Create the series with proper method
        const candlestickSeries = chart.addCandlestickSeries(candlestickOptions);
        setSeries(candlestickSeries);
        
        // If we have an asset, load its data
        if (asset) {
          const loadData = async () => {
            try {
              const { fetchChartData } = await import('../../services/dataService');
              const chartData = await fetchChartData(asset.id, timeframe);
              
              if (chartData && chartData.length > 0) {
                // Format data for the chart
                const formattedData = chartData.map((candle: any) => ({
                  time: candle.time as UTCTimestamp,
                  open: candle.open,
                  high: candle.high,
                  low: candle.low,
                  close: candle.close,
                }));
                
                candlestickSeries.setData(formattedData);
              }
            } catch (error) {
              console.error('Error loading chart data:', error);
            }
          };
          
          loadData();
          
          // Show toast notification when chart loads successfully
          toast.success(`${asset.symbol} chart loaded successfully`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (seriesError) {
        console.error('Error creating candlestick series:', seriesError);
        
        // Fallback to a line series if candlestick fails
        try {
          const lineSeries = chart.addLineSeries({ 
            color: '#2962FF',
            lineWidth: 2,
          });
          
          setSeries(lineSeries);
          
          // Convert candlestick data to line data
          if (asset) {
            const loadLineData = async () => {
              try {
                const { fetchChartData } = await import('../../services/dataService');
                const chartData = await fetchChartData(asset.id, timeframe);
                
                if (chartData && chartData.length > 0) {
                  // Format data for line series
                  const lineData = chartData.map((candle: any) => ({
                    time: candle.time as UTCTimestamp,
                    value: candle.close,
                  }));
                  
                  lineSeries.setData(lineData);
                }
              } catch (error) {
                console.error('Error loading line chart data:', error);
              }
            };
            
            loadLineData();
            
            // Notify user of fallback to line chart
            toast.info(`Using line chart for ${asset.symbol}`, {
              position: "bottom-right",
              autoClose: 2000,
            });
          }
        } catch (fallbackError) {
          console.error('Fallback chart rendering also failed:', fallbackError);
          toast.error('Chart rendering failed. Please refresh the page.', {
            position: "bottom-right",
            autoClose: 5000,
          });
        }
      }

      // Handle window resize
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance) {
          chartInstance.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing chart:', error);
      toast.error('Failed to initialize chart. Please try again.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  }, [chartContainerRef.current, asset?.id]); // Re-run when container is created or asset changes

  // Update chart data when asset or timeframe changes
  useEffect(() => {
    if (!series || !asset || !chartInstance) return;
    
    // Load chart data with improved error handling
    const loadChartData = async () => {
      try {
        const { getAssetChartData } = await import('../../data/mockData');
        const isIntraday = timeframe !== '1d';
        const mockChartData = getAssetChartData(asset.id, isIntraday ? 'intraday' : 'daily');
        
        if (!mockChartData || mockChartData.length === 0) {
          throw new Error('No chart data available');
        }
        
        // Always try candlestick format first
        try {
          const formattedData = mockChartData.map((candle: any) => ({
            time: candle.time as UTCTimestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }));
          
          series.setData(formattedData);
          
          // Update chart view
          if (chartInstance) {
            chartInstance.priceScale('right').applyOptions({
              autoScale: true,
              alignLabels: true,
              borderVisible: true,
              borderColor: '#2B2B43',
              scaleMargins: {
                top: 0.1,
                bottom: 0.2,
              },
            });
            
            chartInstance.timeScale().fitContent();
          }
          
          // Success notification
          toast.success(`${asset.symbol} chart loaded successfully`, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
          });
          
        } catch (candlestickError) {
          console.warn('Candlestick format failed, trying line series:', candlestickError);
          
          // Fallback to line series
          const lineData = mockChartData.map((candle: any) => ({
            time: candle.time as UTCTimestamp,
            value: candle.close,
          }));
          
          series.setData(lineData);
          
          if (chartInstance) {
            chartInstance.timeScale().fitContent();
          }
          
          toast.info(`${asset.symbol} loaded as line chart`, {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
        
      } catch (error) {
        console.error('Error loading chart data:', error);
        toast.error(`Failed to load ${asset.symbol} chart`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };
    
    loadChartData();
  }, [series, asset, timeframe, chartInstance]);

  const handleTimeframeChange = (newTimeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d') => {
    setTimeframe(newTimeframe);
    
    // Show loading indicator for timeframe change
    toast.info(`Loading ${newTimeframe} timeframe...`, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
    });
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    // Resize the chart after the animation completes
    setTimeout(() => {
      if (chartContainerRef.current && chartInstance) {
        chartInstance.resize(
          chartContainerRef.current.clientWidth, 
          chartContainerRef.current.clientHeight - 40
        );
        
        // Fit content after resize for better view
        chartInstance.timeScale().fitContent();
      }
    }, 300);
    
    // Notify user
    toast.info(fullscreen ? 'Exiting fullscreen' : 'Entering fullscreen', {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
    });
  };

  const refreshData = () => {
    if (!series || !asset) return;
    
    // Show loading indicator
    toast.info(`Refreshing ${asset.symbol} data...`, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
    });
    
    try {
      // Get fresh chart data
      const isIntraday = timeframe !== '1d';
      const chartData = getAssetChartData(asset.id, isIntraday ? 'intraday' : 'daily');
      
      // Determine series type and update appropriately
      if (series.seriesType) {
        const seriesType = series.seriesType();
        
        if (seriesType === 'Candlestick') {
          // Format data for candlestick series
          const formattedData = chartData.map((candle: any) => ({
            time: candle.time as UTCTimestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }));
          
          series.setData(formattedData);
          
          // Add marker for current price
          const lastCandle = formattedData[formattedData.length - 1];
          if (lastCandle) {
            series.createPriceLine({
              price: lastCandle.close,
              color: '#2962FF',
              lineWidth: 1,
              lineStyle: 1, // LineStyle.Dashed
              axisLabelVisible: true,
              title: 'Last Price',
            });
          }
        } else {
          // For line series
          const lineData = chartData.map((candle: any) => ({
            time: candle.time as UTCTimestamp,
            value: candle.close,
          }));
          
          series.setData(lineData);
        }
        
        // Adjust time scale to fit content
        if (chartInstance) {
          chartInstance.timeScale().fitContent();
        }
        
        // Success notification
        toast.success(`${asset.symbol} data refreshed`, {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        // Default handling if type check doesn't work
        try {
          // Try as candlestick first
          const formattedData = chartData.map((candle: any) => ({
            time: candle.time as UTCTimestamp,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }));
          
          series.setData(formattedData);
          
          toast.success(`${asset.symbol} data refreshed`, {
            position: "bottom-right",
            autoClose: 2000,
          });
        } catch (error) {
          // Fallback to line series
          const lineData = chartData.map((candle: any) => ({
            time: candle.time as UTCTimestamp,
            value: candle.close,
          }));
          
          series.setData(lineData);
          
          toast.info(`${asset.symbol} data refreshed (line view)`, {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing chart data:', error);
      toast.error(`Failed to refresh ${asset.symbol} data`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  
  // Function to handle zoom in
  const handleZoomIn = () => {
    if (chartInstance) {
      // Get current visible range
      const timeScale = chartInstance.timeScale();
      const visibleRange = timeScale.getVisibleLogicalRange();
      
      if (visibleRange) {
        // Calculate new range (zoom in by 30%)
        const newRange = {
          from: visibleRange.from + (visibleRange.to - visibleRange.from) * 0.15,
          to: visibleRange.to - (visibleRange.to - visibleRange.from) * 0.15,
        };
        
        // Apply new range
        timeScale.setVisibleLogicalRange(newRange);
      }
    }
  };
  
  // Function to handle zoom out
  const handleZoomOut = () => {
    if (chartInstance) {
      // Get current visible range
      const timeScale = chartInstance.timeScale();
      const visibleRange = timeScale.getVisibleLogicalRange();
      
      if (visibleRange) {
        // Calculate new range (zoom out by 30%)
        const newRange = {
          from: visibleRange.from - (visibleRange.to - visibleRange.from) * 0.15,
          to: visibleRange.to + (visibleRange.to - visibleRange.from) * 0.15,
        };
        
        // Apply new range
        timeScale.setVisibleLogicalRange(newRange);
      }
    }
  };
  
  // Function to reset time view to auto
  const handleResetTime = () => {
    if (chartInstance) {
      chartInstance.timeScale().fitContent();
      toast.info('Chart view reset', {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className={`absolute flex flex-col overflow-hidden bg-gray-900 rounded-md shadow-lg border border-gray-800 transition-all duration-300 ${
      fullscreen ? 'fixed inset-0 z-50' : 'h-full w-full'
    }`}>
      <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
        <div className="font-medium text-gray-200 flex items-center">
          {asset ? (
            <>
              <span>{asset.symbol}</span>
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                asset.changePercent >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
              </span>
            </>
          ) : 'Chart'}
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={refreshData}
            className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
      
      <div className="px-3 py-1.5 border-b border-gray-800 flex items-center">
        <div className="flex space-x-1 text-xs">
          <button 
            onClick={() => handleTimeframeChange('1m')}
            className={`px-2 py-0.5 rounded ${timeframe === '1m' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            1m
          </button>
          <button 
            onClick={() => handleTimeframeChange('5m')}
            className={`px-2 py-0.5 rounded ${timeframe === '5m' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            5m
          </button>
          <button 
            onClick={() => handleTimeframeChange('15m')}
            className={`px-2 py-0.5 rounded ${timeframe === '15m' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            15m
          </button>
          <button 
            onClick={() => handleTimeframeChange('1h')}
            className={`px-2 py-0.5 rounded ${timeframe === '1h' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            1h
          </button>
          <button 
            onClick={() => handleTimeframeChange('4h')}
            className={`px-2 py-0.5 rounded ${timeframe === '4h' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            4h
          </button>
          <button 
            onClick={() => handleTimeframeChange('1d')}
            className={`px-2 py-0.5 rounded ${timeframe === '1d' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            1d
          </button>
        </div>
        
        <div className="ml-auto flex space-x-1">
          <button 
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button 
            onClick={handleResetTime}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            title="Reset Time Scale"
          >
            <Clock size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden" ref={chartContainerRef}>
        {!chartInstance && (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}
