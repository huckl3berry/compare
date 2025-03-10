
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatPrice } from '@/utils/formatters';

interface PriceTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  chartType: 'price' | 'price-per-gb';
  getProviderUrl: (provider: string) => string;
}

const PriceTooltip: React.FC<PriceTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  chartType, 
  getProviderUrl 
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="fixed bg-popover/98 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 text-popover-foreground text-sm z-[1000]"
        style={{ 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: 'auto',
          minWidth: '220px',
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <p className="font-semibold mb-1">{data.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Provider:</span>
          <a 
            href={getProviderUrl(data.provider)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            {data.provider}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="font-medium">
          {chartType === 'price-per-gb' ? 'Price per GB VRAM: ' : 'Price per Hour: '}
          {formatPrice(data.value)}
        </p>
        <div className="mt-2 pt-1 border-t border-border">
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs text-primary"
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
          className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
          onClick={() => document.dispatchEvent(new CustomEvent('clearTooltip'))}
        >
          ✕
        </button>
      </div>
    );
  }
  return null;
};

export default PriceTooltip;
