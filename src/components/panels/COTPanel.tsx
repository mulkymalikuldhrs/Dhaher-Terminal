
import { useState, useEffect } from 'react';
import { BarChart3, Users, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { Asset, PanelProps } from '../../types';
import { fetchCOTData } from '../../services/institutionalDataService';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface COTData {
  reportDate: string;
  commercialLong: number;
  commercialShort: number;
  nonCommercialLong: number;
  nonCommercialShort: number;
  netPosition: number;
  trend: 'bullish' | 'bearish';
}

export default function COTPanel({ panel, assets }: PanelProps) {
  const [cotData, setCOTData] = useState<COTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState<Asset | undefined>(undefined);

  useEffect(() => {
    if (!panel.assetId) return;
    
    const foundAsset = assets.find(a => a.id === panel.assetId);
    if (foundAsset) {
      setAsset(foundAsset);
    }
  }, [panel.assetId, assets]);

  useEffect(() => {
    if (!asset) return;

    const loadCOTData = async () => {
      try {
        setLoading(true);
        const data = await fetchCOTData(asset);
        setCOTData(data);
      } catch (error) {
        console.error('Error loading COT data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCOTData();
  }, [asset]);

  if (!asset) {
    return (
      <div className="h-full flex items-center justify-center bloomberg-panel">
        <div className="text-center text-gray-500">
          <BarChart3 size={24} className="mx-auto mb-2" />
          <div>Select an asset to view COT data</div>
        </div>
      </div>
    );
  }

  const chartData = cotData ? [
    {
      name: 'Commercial',
      long: cotData.commercialLong,
      short: -cotData.commercialShort,
      net: cotData.commercialLong - cotData.commercialShort
    },
    {
      name: 'Non-Commercial',
      long: cotData.nonCommercialLong,
      short: -cotData.nonCommercialShort,
      net: cotData.nonCommercialLong - cotData.nonCommercialShort
    }
  ] : [];

  const getPositionColor = (value: number) => {
    return value >= 0 ? '#22c55e' : '#ef4444';
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bloomberg-panel">
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 size={14} className="mr-1" />
          <span>{asset.symbol} COT</span>
        </div>
        <div className="text-[10px] font-normal">CFTC POSITIONING</div>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading COT data...
          </div>
        </div>
      ) : !cotData ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 size={24} className="mx-auto mb-2" />
            <div>COT data not available</div>
            <div className="text-xs mt-1">for {asset.symbol}</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-3">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-800/50 rounded-md p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Building2 size={12} className="mr-1 text-blue-400" />
                  <span className="text-xs text-gray-400">Commercial</span>
                </div>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  cotData.commercialLong > cotData.commercialShort 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {cotData.commercialLong > cotData.commercialShort ? 'NET LONG' : 'NET SHORT'}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-200">
                Net: {(cotData.commercialLong - cotData.commercialShort).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                L: {cotData.commercialLong.toLocaleString()} | 
                S: {cotData.commercialShort.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-md p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Users size={12} className="mr-1 text-yellow-400" />
                  <span className="text-xs text-gray-400">Speculative</span>
                </div>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  cotData.nonCommercialLong > cotData.nonCommercialShort 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {cotData.nonCommercialLong > cotData.nonCommercialShort ? 'NET LONG' : 'NET SHORT'}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-200">
                Net: {(cotData.nonCommercialLong - cotData.nonCommercialShort).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                L: {cotData.nonCommercialLong.toLocaleString()} | 
                S: {cotData.nonCommercialShort.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* COT Chart */}
          <div className="bg-gray-800/50 rounded-md p-3 mb-4">
            <div className="text-sm text-gray-400 mb-2">Net Positions</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar dataKey="net" radius={[2, 2, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={getPositionColor(entry.net)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Market Insight */}
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="text-sm text-gray-400 mb-2">Market Insight</div>
            <div className="flex items-start space-x-2">
              {cotData.trend === 'bullish' ? (
                <TrendingUp size={16} className="text-green-400 mt-0.5" />
              ) : (
                <TrendingDown size={16} className="text-red-400 mt-0.5" />
              )}
              <div>
                <div className="text-sm text-gray-200 mb-1">
                  {cotData.trend === 'bullish' ? 'Bullish Institutional Bias' : 'Bearish Institutional Bias'}
                </div>
                <div className="text-xs text-gray-400">
                  {cotData.trend === 'bullish' 
                    ? 'Large speculators are net long, suggesting bullish sentiment among institutional traders.'
                    : 'Large speculators are net short, suggesting bearish sentiment among institutional traders.'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Report Date: {new Date(cotData.reportDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
