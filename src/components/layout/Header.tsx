import { useState, useEffect } from 'react';
import { Activity, Globe, Info, Menu, Moon, Search, Settings, Sun, Terminal, User, LogIn, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import NotificationPanel from '../notifications/NotificationPanel';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const [command, setCommand] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [marketData, setMarketData] = useState([
    { symbol: 'EURUSD', price: 1.0865, change: +0.0023 },
    { symbol: 'USDJPY', price: 107.25, change: -0.15 },
    { symbol: 'GBPUSD', price: 1.2651, change: +0.0045 },
    { symbol: 'AUDUSD', price: 0.6932, change: -0.0012 },
    { symbol: 'USDCAD', price: 1.3524, change: +0.0034 },
    { symbol: 'GOLD', price: 1892.50, change: +7.25 },
    { symbol: 'OIL', price: 41.23, change: -0.72 },
    { symbol: 'S&P500', price: 3425.75, change: +12.35 },
  ]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      
      // Simulate small price changes for ticker
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() * 0.01 - 0.005),
        change: item.change + (Math.random() * 0.002 - 0.001)
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };
  
  const handleCommandEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('Command entered:', command);
      setCommand('');
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-3 py-1.5 bloomberg-header">
        <div className="flex items-center">
          <div className="font-bold text-lg mr-4 text-white">
            <span className="text-[#3a7ca5]">D</span>HAHER <span className="text-[#3a7ca5]">T</span>ERMINAL
          </div>
          <div className="hidden md:flex space-x-1">
            <button className="px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-[#2d5986] text-[#8da2c0]">MKTS</button>
            <button className="px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-[#2d5986] text-[#8da2c0]">TRDG</button>
            <button className="px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-[#2d5986] text-[#8da2c0]">PORT</button>
            <button className="px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-[#2d5986] text-[#8da2c0]">ANLYS</button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-4 text-[#8da2c0] text-xs">
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="font-mono">CONN: ACTIVE</span>
            </div>
            <div className="mr-2">
              <span className="font-mono">
                NY: {time.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="font-mono">
                WIB: {time.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={toggleLanguage}
              className="p-1.5 hover:bg-[#2d5986] text-[#8da2c0]"
              title={language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
            >
              <Globe size={16} />
            </button>
            <button className="p-1.5 hover:bg-[#2d5986] text-[#8da2c0]" title="Terminal Commands">
              <Terminal size={16} />
            </button>
            <button className="p-1.5 hover:bg-[#2d5986] text-[#8da2c0]" title="Market Activity">
              <Activity size={16} />
            </button>
            <NotificationPanel />
            <button className="p-1.5 hover:bg-[#2d5986] text-[#8da2c0]" title="Settings">
              <Settings size={16} />
            </button>
            
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 p-1.5 hover:bg-[#2d5986] text-[#8da2c0]"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={`Logged in as ${user?.name || user?.login}`}
                >
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name || user.login}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User size={16} />
                  )}
                  {!showUserMenu && (
                    <span className="hidden md:block text-xs font-mono">
                      {user?.login}
                    </span>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-[#1a2437] border border-[#2c3645] shadow-lg z-50">
                    <div className="p-3 border-b border-[#2c3645]">
                      <div className="flex items-center space-x-3">
                        {user?.avatar_url && (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name || user.login}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {user?.name || user?.login}
                          </div>
                          <div className="text-[#8da2c0] text-xs">
                            @{user?.login}
                          </div>
                          {user?.location && (
                            <div className="text-[#8da2c0] text-xs">
                              📍 {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {user?.bio && (
                        <div className="text-[#8da2c0] text-xs mt-2">
                          {user.bio}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#8da2c0] mb-2">
                        <div>
                          <div className="font-mono text-white">{user?.public_repos || 0}</div>
                          <div>Repos</div>
                        </div>
                        <div>
                          <div className="font-mono text-white">{user?.followers || 0}</div>
                          <div>Followers</div>
                        </div>
                        <div>
                          <div className="font-mono text-white">{user?.following || 0}</div>
                          <div>Following</div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs hover:bg-[#2d5986] text-[#8da2c0]"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center space-x-1 px-2 py-1.5 hover:bg-[#2d5986] text-[#8da2c0] text-xs"
                title="Sign in with GitHub"
              >
                <LogIn size={14} />
                <span className="hidden md:block">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>
      
      <div className="bloomberg-ticker py-1 text-xs">
        <div className="bloomberg-ticker-content">
          {marketData.map((item, index) => (
            <span key={index} className="mx-4">
              <span className="text-[#8da2c0]">{item.symbol}</span>
              <span className="mx-1 bloomberg-mono">{item.price.toFixed(4)}</span>
              <span className={item.change >= 0 ? 'bloomberg-positive' : 'bloomberg-negative'}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(4)}
              </span>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center px-3 py-1.5 bg-[#121a29] border-b border-[#2c3645]">
        <div className="flex-1 flex">
          <button className="p-1.5 text-[#8da2c0] hover:bg-[#2d5986] mr-2">
            <Menu size={16} />
          </button>
          <div className="hidden sm:flex space-x-1">
            <button className="px-2 py-1 text-xs hover:bg-[#2d5986] text-[#8da2c0]">HOME</button>
            <button className="px-2 py-1 text-xs hover:bg-[#2d5986] text-[#8da2c0]">WATCHLIST</button>
            <button className="px-2 py-1 text-xs hover:bg-[#2d5986] text-[#8da2c0]">CHARTS</button>
            <button className="px-2 py-1 text-xs hover:bg-[#2d5986] text-[#8da2c0]">NEWS</button>
          </div>
        </div>
        
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Terminal size={12} className="text-[#8da2c0]" />
          </div>
          <input
            type="text"
            className="bloomberg-command-bar w-full py-1 pl-7 pr-2 text-xs"
            placeholder="Enter command (e.g. EURUSD CURNCY GO)"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommandEnter}
          />
        </div>
        
        <div className="ml-2 flex">
          <button className="p-1.5 text-[#8da2c0] hover:bg-[#2d5986]">
            <Search size={16} />
          </button>
          <button className="p-1.5 text-[#8da2c0] hover:bg-[#2d5986]">
            <Info size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
