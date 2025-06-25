
import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { PanelProps } from '../../types';
import { fetchEconomicCalendar } from '../../services/institutionalDataService';
import { formatDistanceToNow, format } from 'date-fns';

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: 'High' | 'Medium' | 'Low';
  date: number;
  forecast?: string;
  previous?: string;
  actual?: string;
}

export default function EconomicCalendarPanel({ }: PanelProps) {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium'>('high');

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const calendarData = await fetchEconomicCalendar();
        setEvents(calendarData);
      } catch (error) {
        console.error('Error loading economic calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
    
    // Refresh every 30 minutes
    const interval = setInterval(loadCalendar, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return event.impact === 'High';
    if (selectedFilter === 'medium') return event.impact === 'Medium' || event.impact === 'High';
    return true;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-400 bg-red-900/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'Low': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'AUD': '🇦🇺',
      'CAD': '🇨🇦',
      'CHF': '🇨🇭',
      'NZD': '🇳🇿'
    };
    return flags[country] || '🌍';
  };

  const isEventToday = (timestamp: number) => {
    const today = new Date();
    const eventDate = new Date(timestamp);
    return eventDate.toDateString() === today.toDateString();
  };

  const isEventSoon = (timestamp: number) => {
    const now = Date.now();
    const timeDiff = timestamp - now;
    return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000; // Within 2 hours
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bloomberg-panel">
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>ECONOMIC CALENDAR</span>
        </div>
        <div className="text-[10px] font-normal">HIGH IMPACT EVENTS</div>
      </div>
      
      <div className="px-2 py-1 border-b border-gray-800 flex space-x-1">
        <button
          onClick={() => setSelectedFilter('high')}
          className={`px-2 py-0.5 text-xs rounded ${
            selectedFilter === 'high' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          High Impact
        </button>
        <button
          onClick={() => setSelectedFilter('medium')}
          className={`px-2 py-0.5 text-xs rounded ${
            selectedFilter === 'medium' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          Med+High
        </button>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-2 py-0.5 text-xs rounded ${
            selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          All Events
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No events found for selected filter
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-2 border-l-2 hover:bg-gray-800/50 transition-colors ${
                  isEventSoon(event.date) ? 'border-red-500 bg-red-900/10' :
                  isEventToday(event.date) ? 'border-yellow-500 bg-yellow-900/10' :
                  'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{getCountryFlag(event.currency)}</span>
                    <span className={`px-1.5 py-0.5 text-xs rounded ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                    {isEventSoon(event.date) && (
                      <AlertTriangle size={12} className="text-red-400" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    <Clock size={10} className="inline mr-1" />
                    {format(new Date(event.date), 'HH:mm')}
                  </div>
                </div>
                
                <div className="text-sm text-gray-200 mb-1 font-medium">
                  {event.title}
                </div>
                
                <div className="text-xs text-gray-400">
                  {event.country} • {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                </div>
                
                {(event.forecast || event.previous || event.actual) && (
                  <div className="flex space-x-3 mt-1 text-xs">
                    {event.previous && (
                      <span className="text-gray-400">Prev: {event.previous}</span>
                    )}
                    {event.forecast && (
                      <span className="text-blue-400">Fcst: {event.forecast}</span>
                    )}
                    {event.actual && (
                      <span className={
                        event.forecast && parseFloat(event.actual) > parseFloat(event.forecast) 
                          ? 'text-green-400' 
                          : event.forecast && parseFloat(event.actual) < parseFloat(event.forecast)
                          ? 'text-red-400'
                          : 'text-white'
                      }>
                        Act: {event.actual}
                        {event.forecast && (
                          parseFloat(event.actual) > parseFloat(event.forecast) ? (
                            <TrendingUp size={10} className="inline ml-1" />
                          ) : parseFloat(event.actual) < parseFloat(event.forecast) ? (
                            <TrendingDown size={10} className="inline ml-1" />
                          ) : null
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
