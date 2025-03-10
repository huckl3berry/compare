
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';

interface TileFooterProps {
  onStartChat: () => void;
}

const TileFooter = ({ onStartChat }: TileFooterProps) => {
  return (
    <div className="mt-auto w-full text-center">
      <p className="text-sm text-green-400/80 font-medium mb-4">Powered by Commune AI</p>
      
      <Button 
        onClick={onStartChat}
        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Get AI GPU Recommendations</span>
      </Button>
    </div>
  );
};

export default TileFooter;
