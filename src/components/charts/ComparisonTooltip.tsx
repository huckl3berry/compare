
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ComparisonTooltipProps {
  active: boolean;
  payload: any[];
  label?: string;
}

const ComparisonTooltip: React.FC<ComparisonTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Get provider URL
    const getProviderUrl = (provider: string): string => {
      const providerMap: Record<string, string> = {
        'Digital Ocean': 'https://www.digitalocean.com/products/gpu-droplets',
        'Runpod': 'https://www.runpod.io/pricing',
        'Vast': 'https://vast.ai/pricing',
        'Valdi': 'https://www.valdi.ai/compute',
        'Coreweave': 'https://www.coreweave.com/pricing',
        'Nebius': 'https://nebius.com/prices',
        'Tencent Cloud': 'https://www.tencentcloud.com/products/gpu'
      };
      
      return providerMap[provider] || '';
    };
    
    return (
      <div 
        className="fixed bg-black/90 p-3 rounded-lg shadow-lg border border-gray-700 text-white z-[1000]"
        style={{ 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: 'auto',
          minWidth: '200px',
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium">{data.provider}</p>
          <a 
            href={getProviderUrl(data.provider)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 text-xs inline-flex items-center gap-0.5"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p>Avg Price/GB: ${data.avgPricePerGB.toFixed(3)}</p>
        <p>GPU Options: {data.gpuCount}</p>
        <p>Avg VRAM: {data.avgVram.toFixed(1)} GB</p>
        <div className="mt-2 pt-1 border-t border-gray-700">
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-6 text-xs text-primary"
            asChild
          >
            <a 
              href={getProviderUrl(data.provider)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Visit Provider
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        <button 
          className="absolute top-1 right-1 text-gray-400 hover:text-white"
          onClick={() => document.dispatchEvent(new CustomEvent('clearTooltip'))}
        >
          ✕
        </button>
      </div>
    );
  }
  return null;
};

export default ComparisonTooltip;
