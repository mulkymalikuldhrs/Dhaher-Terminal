import { useEffect, useState } from 'react';
import { PanelProps } from '../../types';
import { fetchClusterDelta, ClusterDeltaLevel } from '../../services/orderFlowService';

export default function OrderFlowPanel({ panel, assets, onClose }: PanelProps) {
  const [data, setData] = useState<ClusterDeltaLevel[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolve the asset
  const asset = assets.find(a => a.id === panel.assetId) || assets[0];

  useEffect(() => {
    const loadData = async () => {
      if (!asset) return;
      setLoading(true);
      const cluster = await fetchClusterDelta(asset);
      setData(cluster);
      setLoading(false);
    };
    loadData();
  }, [asset]);

  if (!asset) {
    return (
      <div className="bloomberg-panel flex items-center justify-center text-gray-400 h-full">
        Asset not found.
      </div>
    );
  }

  return (
    <div className="bloomberg-panel h-full text-[10px]">
      <div className="border-b border-[#2c3645] px-2 py-1 flex items-center justify-between text-[#8da2c0] uppercase tracking-wide">
        <span>Order Flow – Cluster Delta: {asset.symbol}</span>
        <button onClick={() => onClose(panel.id)} className="text-xs hover:text-red-400">✕</button>
      </div>

      {loading ? (
        <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-auto h-full p-1">
          <table className="min-w-full text-right border-collapse">
            <thead>
              <tr className="sticky top-0 bg-[#1a2437] text-[#8da2c0]">
                <th className="px-1 py-0.5">Price</th>
                <th className="px-1 py-0.5">Bid ⬇</th>
                <th className="px-1 py-0.5">Ask ⬆</th>
                <th className="px-1 py-0.5">Δ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((level) => {
                // Determine bg colour gradient for delta
                const maxDelta = Math.max(...data.map(d => Math.abs(d.delta))) || 1;
                const intensity = Math.abs(level.delta) / maxDelta;
                const colour = level.delta > 0 ? `rgba(0, 138, 62, ${intensity})` : `rgba(180, 26, 37, ${intensity})`;

                return (
                  <tr key={level.price} style={{ backgroundColor: colour }}>
                    <td className="px-1 py-0.5 font-mono">{level.price.toFixed(5)}</td>
                    <td className="px-1 py-0.5">{level.bidVolume}</td>
                    <td className="px-1 py-0.5">{level.askVolume}</td>
                    <td className="px-1 py-0.5 font-semibold">{level.delta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}