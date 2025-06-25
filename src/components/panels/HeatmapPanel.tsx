import { useEffect, useRef } from 'react';
import { Asset, PanelProps } from '../../types';

interface HeatmapItem {
  id: string;
  symbol: string;
  value: number;
  color: string;
  size: number;
}

export default function HeatmapPanel({ assets }: PanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const generateHeatmapData = (): HeatmapItem[] => {
    return assets.map(asset => {
      // Determine color based on change percent
      const value = asset.changePercent;
      let color = '';
      
      if (value > 2) color = 'rgba(16, 185, 129, 0.9)'; // Strong green
      else if (value > 1) color = 'rgba(16, 185, 129, 0.7)'; // Medium green
      else if (value > 0) color = 'rgba(16, 185, 129, 0.5)'; // Light green
      else if (value > -1) color = 'rgba(239, 68, 68, 0.5)'; // Light red
      else if (value > -2) color = 'rgba(239, 68, 68, 0.7)'; // Medium red
      else color = 'rgba(239, 68, 68, 0.9)'; // Strong red
      
      // Determine size based on volume (normalized)
      const maxVolume = Math.max(...assets.map(a => a.volume));
      const minSize = 60;
      const maxSize = 120;
      const size = minSize + ((asset.volume / maxVolume) * (maxSize - minSize));
      
      return {
        id: asset.id,
        symbol: asset.symbol,
        value,
        color,
        size
      };
    });
  };
  
  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const heatmapData = generateHeatmapData();
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#1E2130';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#2B2B43';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Position heatmap items using a simple algorithm
    // This is a basic implementation - a real heatmap would use a more sophisticated algorithm
    const positions: { x: number, y: number, width: number, height: number }[] = [];
    const padding = 10;
    
    // Place items using a simple grid layout
    const cols = 4;
    const cellWidth = (width - padding) / cols;
    
    heatmapData.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = col * cellWidth + padding;
      const y = row * 120 + padding;
      
      positions.push({
        x,
        y,
        width: item.size,
        height: 100
      });
    });
    
    // Draw heatmap items
    heatmapData.forEach((item, index) => {
      const pos = positions[index];
      
      // Draw rectangle
      ctx.fillStyle = item.color;
      ctx.fillRect(pos.x, pos.y, pos.width, pos.height);
      
      // Draw border
      ctx.strokeStyle = '#2B2B43';
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x, pos.y, pos.width, pos.height);
      
      // Draw symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.symbol, pos.x + pos.width / 2, pos.y + 30);
      
      // Draw value
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText(
        `${item.value >= 0 ? '+' : ''}${item.value.toFixed(2)}%`, 
        pos.x + pos.width / 2, 
        pos.y + 60
      );
    });
  };
  
  useEffect(() => {
    // Set canvas size
    if (canvasRef.current) {
      const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
      const containerHeight = canvasRef.current.parentElement?.clientHeight || 600;
      
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = containerHeight;
      
      drawHeatmap();
    }
    
    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
        const containerHeight = canvasRef.current.parentElement?.clientHeight || 600;
        
        canvasRef.current.width = containerWidth;
        canvasRef.current.height = containerHeight;
        
        drawHeatmap();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [assets]);
  
  return (
    <div className="h-full flex flex-col overflow-hidden bloomberg-panel">
      <div className="px-2 py-1.5 bloomberg-panel-header flex items-center justify-between">
        <div>MARKET HEATMAP</div>
        <div className="flex items-center text-[10px]">
          <div className="flex items-center ml-2">
            <div className="w-2 h-2 bg-[#c91a1a] mr-1"></div>
            <span>BEARISH</span>
          </div>
          <div className="flex items-center ml-2">
            <div className="w-2 h-2 bg-[#00873c] mr-1"></div>
            <span>BULLISH</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
}
