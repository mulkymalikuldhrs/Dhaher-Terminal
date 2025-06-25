import { PieChart } from 'recharts';
import { PieChart as PieChartIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { Asset, PanelProps } from '../../types';
import { useSentiment } from '../../hooks/useMarketData';

export default function SentimentPanel({ assets }: PanelProps) {
  const { sentiment, loading, error } = useSentiment();
  
  // If sentiment data is loading or has error, use calculated data from props
  const calculateAverageSentiment = () => {
    if (assets.length === 0) return { long: 50, short: 50 };
    
    const totalLong = assets.reduce((sum, asset) => sum + asset.retailSentiment.long, 0);
    const totalShort = assets.reduce((sum, asset) => sum + asset.retailSentiment.short, 0);
    
    return {
      long: Math.round(totalLong / assets.length),
      short: Math.round(totalShort / assets.length)
    };
  };
  
  const averageSentiment = sentiment ? sentiment.averageSentiment : calculateAverageSentiment();
  const mostBullishAsset = sentiment ? sentiment.mostBullish : [...assets].sort((a, b) => b.retailSentiment.long - a.retailSentiment.long)[0];
  const mostBearishAsset = sentiment ? sentiment.mostBearish : [...assets].sort((a, b) => b.retailSentiment.short - a.retailSentiment.short)[0];
  const extremeSentimentAssets = sentiment ? sentiment.extremeSentiment : assets.filter(
    asset => asset.retailSentiment.long > 70 || asset.retailSentiment.short > 70
  );
  
  return (
    <div className="h-full flex flex-col overflow-hidden bloomberg-panel">
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div className="flex items-center">
          <PieChartIcon size={14} className="mr-1" />
          <span>MARKET SENTIMENT</span>
        </div>
        <div className="text-[10px] font-normal">DHAHER ANALYTICS</div>
      </div>
      
      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="text-sm text-gray-400 mb-1">Overall Market Sentiment</div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-green-400">{averageSentiment.long}% Long</span>
              <span className="text-xs text-red-400">{averageSentiment.short}% Short</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400" 
                style={{ width: `${averageSentiment.long}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="text-sm text-gray-400 mb-2">Sentiment Bias</div>
            <div className="flex items-center">
              {averageSentiment.long > averageSentiment.short ? (
                <>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-900/50 mr-3">
                    <TrendingUp size={16} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-green-400 font-medium">Bullish Bias</div>
                    <div className="text-xs text-gray-500">Market leans bullish</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-900/50 mr-3">
                    <TrendingDown size={16} className="text-red-400" />
                  </div>
                  <div>
                    <div className="text-red-400 font-medium">Bearish Bias</div>
                    <div className="text-xs text-gray-500">Market leans bearish</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="text-sm text-gray-400 mb-2">Most Bullish Asset</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-200">{mostBullishAsset.symbol}</div>
                <div className="text-xs text-gray-500">{mostBullishAsset.name}</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-medium">{mostBullishAsset.retailSentiment.long}% Long</div>
                <div className="text-xs text-gray-500">{mostBullishAsset.retailSentiment.short}% Short</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-md p-3">
            <div className="text-sm text-gray-400 mb-2">Most Bearish Asset</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-200">{mostBearishAsset.symbol}</div>
                <div className="text-xs text-gray-500">{mostBearishAsset.name}</div>
              </div>
              <div className="text-right">
                <div className="text-red-400 font-medium">{mostBearishAsset.retailSentiment.short}% Short</div>
                <div className="text-xs text-gray-500">{mostBearishAsset.retailSentiment.long}% Long</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-2">Extreme Sentiment Assets</div>
          <div className="space-y-2">
            {extremeSentimentAssets.map((asset) => (
              <div key={asset.id} className="bg-gray-800/50 rounded-md p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-200">{asset.symbol}</div>
                  {asset.retailSentiment.long > 70 ? (
                    <div className="px-2 py-0.5 text-xs rounded bg-green-900/50 text-green-300">
                      Extremely Bullish
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 text-xs rounded bg-red-900/50 text-red-300">
                      Extremely Bearish
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-green-400">{asset.retailSentiment.long}% Long</span>
                  <span className="text-xs text-red-400">{asset.retailSentiment.short}% Short</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400" 
                    style={{ width: `${asset.retailSentiment.long}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            {extremeSentimentAssets.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-2">
                No assets with extreme sentiment found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
