// @ts-nocheck
// Web Push Notification Service for Real-time Alerts
export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

class WebNotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission;

  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = {
      granted: Notification.permission === 'granted',
      denied: Notification.permission === 'denied',
      default: Notification.permission === 'default'
    };
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    if (this.permission.granted) {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default'
      };
      
      return this.permission.granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Send desktop notification
  async sendNotification(notification: PushNotification): Promise<Notification | null> {
    if (!this.isSupported || !this.permission.granted) {
      console.warn('Notifications not available or permission not granted');
      return null;
    }

    try {
      const options: NotificationOptions = {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/favicon.ico',
        tag: notification.tag,
        data: notification.data,
        requireInteraction: true,
        actions: notification.actions,
      };

      const notif = new Notification(notification.title, options);
      
      // Auto close after 10 seconds
      setTimeout(() => {
        notif.close();
      }, 10000);

      // Handle click events
      notif.onclick = (event) => {
        event.preventDefault();
        window.focus(); // Focus the browser window
        notif.close();
        
        // Handle specific actions based on notification data
        if (notification.data?.url) {
          window.open(notification.data.url, '_blank');
        }
      };

      return notif;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Send trading signal notification
  async sendSignalNotification(signal: {
    symbol: string;
    type: 'buy' | 'sell';
    price: number;
    reason: string;
    strength: 'weak' | 'medium' | 'strong';
  }) {
    const emoji = signal.type === 'buy' ? '📈' : '📉';
    const strengthEmoji = {
      weak: '⚪',
      medium: '🟡',
      strong: '🔴'
    };

    await this.sendNotification({
      title: `${emoji} ${signal.type.toUpperCase()} Signal: ${signal.symbol}`,
      body: `${strengthEmoji[signal.strength]} ${signal.reason}\nPrice: ${signal.price}`,
      icon: '/favicon.ico',
      tag: `signal-${signal.symbol}`,
      data: {
        type: 'signal',
        symbol: signal.symbol,
        signalType: signal.type,
        price: signal.price
      },
      actions: [
        {
          action: 'view',
          title: 'View Chart'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  }

  // Send price alert notification
  async sendPriceAlert(alert: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }) {
    const emoji = alert.change >= 0 ? '🚀' : '📉';
    const direction = alert.change >= 0 ? 'UP' : 'DOWN';

    await this.sendNotification({
      title: `${emoji} Price Alert: ${alert.symbol}`,
      body: `${direction} ${Math.abs(alert.changePercent).toFixed(2)}%\nCurrent Price: ${alert.price}`,
      icon: '/favicon.ico',
      tag: `price-${alert.symbol}`,
      data: {
        type: 'price',
        symbol: alert.symbol,
        price: alert.price,
        change: alert.change
      }
    });
  }

  // Send news notification
  async sendNewsNotification(news: {
    title: string;
    summary: string;
    impact: 'low' | 'medium' | 'high';
    currency?: string;
  }) {
    const impactEmoji = {
      low: '🟢',
      medium: '🟡',
      high: '🔴'
    };

    await this.sendNotification({
      title: `📰 Market News: ${news.title}`,
      body: `${impactEmoji[news.impact]} ${news.summary}${news.currency ? `\nAffects: ${news.currency}` : ''}`,
      icon: '/favicon.ico',
      tag: 'market-news',
      data: {
        type: 'news',
        impact: news.impact,
        currency: news.currency
      }
    });
  }

  // Send market status notification
  async sendMarketStatusNotification(status: {
    market: string;
    status: 'open' | 'closed' | 'pre-market' | 'after-hours';
    nextEvent?: string;
  }) {
    const statusEmoji = {
      open: '🟢',
      closed: '🔴',
      'pre-market': '🟡',
      'after-hours': '🟠'
    };

    await this.sendNotification({
      title: `${statusEmoji[status.status]} ${status.market} Market`,
      body: `Status: ${status.status.toUpperCase()}${status.nextEvent ? `\nNext: ${status.nextEvent}` : ''}`,
      icon: '/favicon.ico',
      tag: `market-${status.market}`,
      data: {
        type: 'market-status',
        market: status.market,
        status: status.status
      }
    });
  }

  // Send system notification
  async sendSystemNotification(message: {
    title: string;
    body: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }) {
    const typeEmoji = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };

    await this.sendNotification({
      title: `${typeEmoji[message.type]} ${message.title}`,
      body: message.body,
      icon: '/favicon.ico',
      tag: 'system',
      data: {
        type: 'system',
        level: message.type
      }
    });
  }

  // Check if notifications are supported
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return { ...this.permission };
  }

  // Test notification
  async sendTestNotification() {
    await this.sendNotification({
      title: '🎯 Dhaher Terminal Test',
      body: 'Notifications are working correctly! You will receive real-time alerts for trading signals, price movements, and market news.',
      icon: '/favicon.ico',
      tag: 'test',
      data: { type: 'test' }
    });
  }
}

// Export singleton instance
export const webNotificationService = new WebNotificationService();
export default webNotificationService;
