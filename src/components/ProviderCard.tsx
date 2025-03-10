
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/formatters';

interface ProviderCardProps {
  provider: string;
  bestPrice: number;
  bestPricePerGB: number;
  gpuCount: number;
  websiteUrl: string;
  logoUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  bestPrice,
  bestPricePerGB,
  gpuCount,
  websiteUrl,
  logoUrl,
  className,
  style
}) => {
  // Determine if this is a "good deal" based on price per GB
  const isGoodDeal = bestPricePerGB < 0.006;
  
  // Simplify provider name for display if needed
  const displayName = provider.replace(/([A-Z])/g, ' $1').trim();
  
  // Format GPU count with plural
  const gpuCountText = `${gpuCount} GPU${gpuCount !== 1 ? 's' : ''}`;

  return (
    <Card className={cn(
      "flex flex-col h-full group transition-all duration-300 overflow-hidden relative",
      "shadow-lg hover:shadow-xl hover:-translate-y-1",
      isGoodDeal ? "border-green-500/70" : "border-orange-400/30",
      "bg-gradient-to-br from-card to-muted/80 backdrop-blur-sm",
      className
    )}
    style={style}
    >
      <CardHeader className="pb-2 relative space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className={cn(
            "text-xl font-semibold",
            isGoodDeal ? "text-green-400" : "text-orange-300"
          )}>
            {displayName}
          </CardTitle>
          <Badge variant={isGoodDeal ? "default" : "outline"} 
            className={cn(
              "font-normal",
              isGoodDeal ? "bg-green-500/80 hover:bg-green-500" : "text-orange-300"
            )}
          >
            {gpuCountText}
          </Badge>
        </div>
        <CardDescription className="text-sm">Cloud GPU Provider</CardDescription>
        
        {isGoodDeal && (
          <div className="absolute -right-2 -top-2">
            <Badge className="bg-green-500 text-white">
              <Check className="h-3.5 w-3.5 mr-1" />
              Best Value
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-orange-300/80">Best Price/Hour</span>
            <span className="font-medium">{formatPrice(bestPrice)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-orange-300/80">Best Price/GB VRAM</span>
            <span className={cn("font-medium", isGoodDeal && "text-green-400")}>{formatPrice(bestPricePerGB)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 mt-auto">
        <Button 
          variant={isGoodDeal ? "default" : "outline"} 
          className={cn(
            "w-full gap-1.5 transition-colors",
            isGoodDeal ? "bg-green-600 hover:bg-green-700" : "text-orange-300 hover:text-orange-200 border-orange-500/50 hover:border-orange-400"
          )}
          asChild
        >
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            tabIndex={0}
          >
            <span>Visit Provider</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </CardFooter>
      
      <div className="absolute -right-16 -top-16 opacity-15 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none">
        <img 
          src={logoUrl}
          alt="GPU Provider Logo" 
          className="h-48 w-48 filter saturate-125 brightness-110 text-green-600" 
        />
      </div>
    </Card>
  );
};

export default ProviderCard;
