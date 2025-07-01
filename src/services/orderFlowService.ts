import { Asset } from '../types';

export interface ClusterDeltaLevel {
  price: number;
  bidVolume: number;
  askVolume: number;
  delta: number; // ask - bid
  totalVolume: number;
}

/**
 * Generate simulated Cluster Delta / Order Flow data for a given asset.
 * For demo purposes we derive 20 price levels around the current price
 * and randomise bid/ask volumes with a bias relative to the latest changePercent.
 */
export const fetchClusterDelta = async (
  asset: Asset,
  levels: number = 20,
): Promise<ClusterDeltaLevel[]> => {
  // Protect against missing asset
  if (!asset) return [];

  // Determine the price tick size roughly (0.01% of price)
  const tickSize = asset.price * 0.0001;

  // Build levels above and below the mid-price
  const half = Math.floor(levels / 2);
  const priceLevels: number[] = [];
  for (let i = -half; i <= half; i++) {
    priceLevels.push(parseFloat((asset.price + i * tickSize).toFixed(5)));
  }

  // Simulate volume with directional bias
  const bullishBias = asset.changePercent > 0;

  const cluster: ClusterDeltaLevel[] = priceLevels.map((levelPrice) => {
    const distance = Math.abs(levelPrice - asset.price) / tickSize;

    // Base volume decays the further the level is from current price
    const baseVol = Math.max(1000 - distance * 40, 100) + Math.random() * 100;

    // Bias: if bullish, more ask aggressive at offer, else more bid aggressive
    const askRatio = bullishBias ? 0.55 + Math.random() * 0.25 : 0.35 + Math.random() * 0.25;
    const askVolume = Math.round(baseVol * askRatio);
    const bidVolume = Math.round(baseVol - askVolume);

    const delta = askVolume - bidVolume;

    return {
      price: levelPrice,
      bidVolume,
      askVolume,
      delta,
      totalVolume: bidVolume + askVolume,
    };
  });

  // Sort descending by price (highest first) like typical footprint chart
  cluster.sort((a, b) => b.price - a.price);

  return cluster;
};