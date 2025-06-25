import { useState } from 'react';
import { Activity, BarChart4, ChevronDown, ChevronsLeft, ChevronsRight, Eye, LineChart, PieChart, TrendingUp, Zap } from 'lucide-react';
import { AssetCategory } from '../../types';

interface SidebarProps {
  onCategorySelect: (category: AssetCategory | 'all') => void;
  selectedCategory: AssetCategory | 'all';
  collapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ onCategorySelect, selectedCategory, collapsed, toggleCollapse }: SidebarProps) {
  const [marketMenuOpen, setMarketMenuOpen] = useState(true);
  const [analysisMenuOpen, setAnalysisMenuOpen] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Markets' },
    { id: 'forex_major', name: 'Forex Majors' },
    { id: 'forex_cross', name: 'Forex Cross' },
    { id: 'forex_exotic', name: 'Forex Exotic' },
    { id: 'commodities', name: 'Commodities' },
    { id: 'indices', name: 'Indices' },
    { id: 'crypto', name: 'Crypto' }
  ];
  
  const toggleMarketMenu = () => setMarketMenuOpen(!marketMenuOpen);
  const toggleAnalysisMenu = () => setAnalysisMenuOpen(!analysisMenuOpen);
  
  return (
    <div className={`h-full text-[#8da2c0] flex flex-col transition-all duration-300 ${collapsed ? 'w-14' : 'w-52'}`} style={{ backgroundColor: '#111827' }}>
      <div className="py-2 px-3 flex items-center justify-between border-b border-[#2c3645]">
        {!collapsed && <span className="font-semibold text-xs uppercase tracking-wider">Terminal</span>}
        <button 
          onClick={toggleCollapse}
          className={`p-1 hover:bg-[#2d5986] ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {/* Markets section */}
        <div>
          <div 
            className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-[#1e293b]"
            onClick={toggleMarketMenu}
          >
            {collapsed ? (
              <PieChart size={16} className="mx-auto" />
            ) : (
              <>
                <PieChart size={16} className="mr-2 text-[#3a7ca5]" />
                <span className="flex-1 text-xs uppercase font-semibold tracking-wider">Markets</span>
                <ChevronDown size={14} className={`transition-transform ${marketMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </div>
          
          {marketMenuOpen && !collapsed && (
            <div className="pl-2">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`flex items-center px-3 py-1 cursor-pointer text-xs ${
                    selectedCategory === category.id ? 'bg-[#2d5986] text-white' : 'hover:bg-[#1e293b]'
                  }`}
                  onClick={() => onCategorySelect(category.id as AssetCategory | 'all')}
                >
                  <span className="font-mono">{category.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Analysis section */}
        <div>
          <div 
            className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-[#1e293b]"
            onClick={toggleAnalysisMenu}
          >
            {collapsed ? (
              <BarChart4 size={16} className="mx-auto" />
            ) : (
              <>
                <BarChart4 size={16} className="mr-2 text-[#3a7ca5]" />
                <span className="flex-1 text-xs uppercase font-semibold tracking-wider">Analysis</span>
                <ChevronDown size={14} className={`transition-transform ${analysisMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </div>
          
          {analysisMenuOpen && !collapsed && (
            <div className="pl-2">
              <div className="flex items-center px-3 py-1 cursor-pointer text-xs hover:bg-[#1e293b]">
                <LineChart size={14} className="mr-2 text-[#8da2c0]" />
                <span className="font-mono">MKTSTR</span>
              </div>
              <div className="flex items-center px-3 py-1 cursor-pointer text-xs hover:bg-[#1e293b]">
                <Activity size={14} className="mr-2 text-[#8da2c0]" />
                <span className="font-mono">SMC</span>
              </div>
              <div className="flex items-center px-3 py-1 cursor-pointer text-xs hover:bg-[#1e293b]">
                <TrendingUp size={14} className="mr-2 text-[#8da2c0]" />
                <span className="font-mono">COT</span>
              </div>
              <div className="flex items-center px-3 py-1 cursor-pointer text-xs hover:bg-[#1e293b]">
                <Eye size={14} className="mr-2 text-[#8da2c0]" />
                <span className="font-mono">LQDTY</span>
              </div>
              <div className="flex items-center px-3 py-1 cursor-pointer text-xs hover:bg-[#1e293b]">
                <Zap size={14} className="mr-2 text-[#8da2c0]" />
                <span className="font-mono">SIGNL</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-2 border-t border-[#2c3645]" style={{ backgroundColor: '#0f1829' }}>
        {!collapsed && (
          <div className="text-[10px] text-[#8da2c0]">
            <div className="font-mono">DATA DELAY: 15 MIN</div>
            <div className="font-mono">LAST: {new Date().toLocaleTimeString()}</div>
            <div className="font-mono mt-1 text-[#3a7ca5]">DHAHER PRO v1.0.5</div>
          </div>
        )}
      </div>
    </div>
  );
}
