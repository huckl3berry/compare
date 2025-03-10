
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GPUChatbot from './GPUChatbot';
import TileHeader from './chatbot/TileHeader';
import TileLogo from './chatbot/TileLogo';
import TileFooter from './chatbot/TileFooter';

interface GPUChatbotTileProps {
  onFilterRecommendation: (filters: any) => void;
  gpuData: any[];
}

const GPUChatbotTile: React.FC<GPUChatbotTileProps> = ({ 
  onFilterRecommendation,
  gpuData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (isExpanded) {
    return (
      <div className="h-full">
        <GPUChatbot 
          onFilterRecommendation={onFilterRecommendation}
          gpuData={gpuData}
          onClose={() => setIsExpanded(false)}
        />
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex flex-col h-full group transition-all duration-300 overflow-hidden relative",
        "shadow-lg hover:shadow-xl hover:-translate-y-1 animate-fade-in",
        "border-2 border-green-500/50 rounded-lg",
        "bg-gradient-to-br from-card via-green-950/10 to-muted/90 backdrop-blur-sm"
      )}
    >
      <div className="p-6 flex flex-col h-full items-center justify-between">
        <TileHeader />
        <TileLogo />
        <TileFooter onStartChat={() => setIsExpanded(true)} />
      </div>
    </div>
  );
};

export default GPUChatbotTile;
