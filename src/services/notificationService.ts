
import { Signal, Asset } from '../types';

interface NotificationPayload {
  type: 'signal' | 'alert' | 'news';
  title: string;
  message: string;
  asset?: Asset;
  signal?: Signal;
}

// WhatsApp Business API integration
export const sendWhatsAppNotification = async (payload: NotificationPayload, phoneNumber: string) => {
  try {
    // In production, this would integrate with Twilio WhatsApp Business API
    // For demo purposes, we'll simulate the API call
    
    const message = formatWhatsAppMessage(payload);
    
    console.log('Sending WhatsApp message:', {
      to: phoneNumber,
      message: message
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      messageId: `wa_${Date.now()}`,
      status: 'sent'
    };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Format message for WhatsApp
const formatWhatsAppMessage = (payload: NotificationPayload): string => {
  switch (payload.type) {
    case 'signal':
      return `🚨 *DHAHER TERMINAL SIGNAL*

📊 *${payload.signal?.type.toUpperCase()} ${payload.asset?.symbol}*
💰 Price: ${payload.asset?.price}
📈 Change: ${payload.asset?.changePercent >= 0 ? '+' : ''}${payload.asset?.changePercent?.toFixed(2)}%
🎯 Reason: ${payload.signal?.reason}
⚡ Strength: ${payload.signal?.strength?.toUpperCase()}

⏰ ${new Date().toLocaleString()}
📱 Dhaher Terminal Pro`;

    case 'alert':
      return `⚠️ *MARKET ALERT*

${payload.title}
${payload.message}

⏰ ${new Date().toLocaleString()}
📱 Dhaher Terminal Pro`;

    case 'news':
      return `📰 *MARKET NEWS*

${payload.title}
${payload.message}

⏰ ${new Date().toLocaleString()}
📱 Dhaher Terminal Pro`;

    default:
      return `📱 *DHAHER TERMINAL*

${payload.title}
${payload.message}

⏰ ${new Date().toLocaleString()}`;
  }
};

// Browser push notifications
export const sendPushNotification = async (payload: NotificationPayload) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'denied') {
    console.log('Notifications are denied');
    return false;
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return false;
    }
  }

  try {
    const notification = new Notification(payload.title, {
      body: payload.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.type,
      requireInteraction: payload.type === 'signal',
      data: payload
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};
