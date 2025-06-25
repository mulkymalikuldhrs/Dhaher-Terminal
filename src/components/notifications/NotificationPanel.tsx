import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from './NotificationService';

export default function NotificationPanel() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };
  
  return (
    <>
      <button 
        onClick={togglePanel}
        className="p-2 rounded-full hover:bg-gray-800 text-gray-300 relative"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 max-h-[500px] bg-gray-900 rounded-md shadow-lg border border-gray-700 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="font-medium">Notifications</div>
            <div className="flex space-x-2">
              <button 
                onClick={markAllAsRead}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                title="Mark all as read"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={clearNotifications}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                title="Clear all notifications"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[450px]">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 hover:bg-gray-800 ${!notification.read ? 'bg-gray-800/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="font-medium text-gray-200">{notification.title}</div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{notification.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <div>No notifications</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
