
import React from 'react';
import { Button } from "@/components/ui/button";
import ProviderCard from '@/components/ProviderCard';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProviderSectionProps {
  providerStats: Array<{
    provider: string;
    bestPrice: number;
    bestPricePerGB: number;
    gpuCount: number;
    websiteUrl: string;
  }>;
  chatbotTile: React.ReactNode;
}

const ProviderSection: React.FC<ProviderSectionProps> = ({ 
  providerStats,
  chatbotTile
}) => {
  return (
    <section className="py-16 relative">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-background z-0"
      />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-green-500">GPU Cloud Providers</h2>
            <p className="text-muted-foreground">
              Compare pricing across these top GPU rental services
            </p>
          </div>
        </div>
        
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Large AI Assistant Tile (spans 2 columns) */}
          <div className="sm:col-span-2">
            {chatbotTile}
          </div>
          
          {/* Provider Cards */}
          {providerStats.map((provider, index) => (
            <ProviderCard 
              key={provider.provider}
              {...provider}
              logoUrl="/lovable-uploads/7476f5dc-74b5-42c4-8c2b-c1211308de1f.png"
              className={cn("animate-fade-in")}
              style={{ '--index': index + 1 } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProviderSection;
