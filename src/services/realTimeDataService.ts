// Real-time data streaming service for enhanced market data
import { Asset, AssetCategory } from '../types';
import { fetchAssets } from './dataService';

export interface RealTimeUpdate {
  assetId: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface RealTimeSubscription {
  assetId: string;
  callback: (update: RealTimeUpdate) => void;
}

class RealTimeDataService {
  private subscriptions: Map<string, RealTimeSubscription[]> = new Map();
  private assets: Asset[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      // Load initial assets
      this.assets = await fetchAssets('all');
      this.startRealTimeUpdates();
    } catch (error) {
      console.error('Failed to initialize real-time service:', error);
    }
  }

  // Subscribe to real-time updates for an asset
  subscribe(assetId: string, callback: (update: RealTimeUpdate) => void): () => void {
    if (!this.subscriptions.has(assetId)) {
      this.subscriptions.set(assetId, []);
    }

    const subscription: RealTimeSubscription = { assetId, callback };
    this.subscriptions.get(assetId)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(assetId);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
        }
        
        // Clean up empty subscription arrays
        if (subs.length === 0) {
          this.subscriptions.delete(assetId);
        }
      }
    };
  }

  // Start real-time price updates
  private startRealTimeUpdates() {
    if (this.isActive) return;

    this.isActive = true;
    this.updateInterval = setInterval(() => {
      this.generatePriceUpdates();
    }, 5000); // Update every 5 seconds
  }

  // Stop real-time updates
  stop() {
    this.isActive = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Generate realistic price updates
  private generatePriceUpdates() {
    this.assets.forEach(asset => {
      if (Math.random() > 0.7) { // 30% chance of update per asset
        const volatility = this.getAssetVolatility(asset.category);
        const changePercent = (Math.random() - 0.5) * volatility * 2;
        const newPrice = asset.price * (1 + changePercent / 100);
        const change = newPrice - asset.price;

        // Update asset data
        asset.price = newPrice;
        asset.change = change;
        asset.changePercent = changePercent;
        asset.volume += Math.floor(Math.random() * asset.volume * 0.1);

        // Create update object
        const update: RealTimeUpdate = {
          assetId: asset.id,
          price: newPrice,
          change,
          changePercent,
          volume: asset.volume,
          timestamp: Date.now()
        };

        // Notify subscribers
        this.notifySubscribers(asset.id, update);
      }
    });
  }

  // Notify all subscribers for an asset
  private notifySubscribers(assetId: string, update: RealTimeUpdate) {
    const subscriptions = this.subscriptions.get(assetId);
    if (subscriptions) {
      subscriptions.forEach(sub => {
        try {
          sub.callback(update);
        } catch (error) {
          console.error('Error notifying subscriber:', error);
        }
      });
    }
  }

  // Get volatility based on asset category
  private getAssetVolatility(category: AssetCategory): number {
    switch (category) {
      case 'crypto': return 5; // 5% max change
      case 'forex_major': return 0.5; // 0.5% max change
      case 'forex_cross': return 0.8;
      case 'forex_exotic': return 1.5;
      case 'commodities': return 2;
      case 'indices': return 1.5;
      default: return 1;
    }
  }

  // Get current asset data
  getAsset(assetId: string): Asset | undefined {
    return this.assets.find(a => a.id === assetId);
  }

  // Get all assets
  getAllAssets(): Asset[] {
    return [...this.assets];
  }

  // Simulate market events
  simulateMarketEvent(eventType: 'news' | 'volatility' | 'trend') {
    const affectedAssets = this.assets.slice(0, Math.floor(Math.random() * 5) + 1);
    
    affectedAssets.forEach(asset => {
      let changeMultiplier = 1;
      
      switch (eventType) {
        case 'news':
          changeMultiplier = Math.random() > 0.5 ? 2 : -2; // Strong positive or negative reaction
          break;
        case 'volatility':
          changeMultiplier = (Math.random() - 0.5) * 4; // High volatility
          break;
        case 'trend':
          changeMultiplier = Math.random() > 0.5 ? 1.5 : -1.5; // Trending movement
          break;
      }

      const volatility = this.getAssetVolatility(asset.category);
      const changePercent = volatility * changeMultiplier;
      const newPrice = asset.price * (1 + changePercent / 100);
      const change = newPrice - asset.price;

      // Update asset
      asset.price = newPrice;
      asset.change = change;
      asset.changePercent = changePercent;

      // Notify subscribers
      const update: RealTimeUpdate = {
        assetId: asset.id,
        price: newPrice,
        change,
        changePercent,
        volume: asset.volume,
        timestamp: Date.now()
      };

      this.notifySubscribers(asset.id, update);
    });
  }

  // Get market summary
  getMarketSummary() {
    const gainers = this.assets
      .filter(a => a.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);

    const losers = this.assets
      .filter(a => a.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);

    const mostActive = this.assets
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    return {
      gainers,
      losers,
      mostActive,
      totalAssets: this.assets.length,
      gainersCount: this.assets.filter(a => a.changePercent > 0).length,
      losersCount: this.assets.filter(a => a.changePercent < 0).length
    };
  }
}

// Export singleton instance
export const realTimeDataService = new RealTimeDataService();
export default realTimeDataService;
