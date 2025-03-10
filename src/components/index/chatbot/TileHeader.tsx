
import React from 'react';
import { MessageSquare } from 'lucide-react';

const TileHeader = () => {
  return (
    <div className="flex flex-col items-center text-center w-full">
      <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
        <MessageSquare className="h-3.5 w-3.5 mr-1" />
        <span>AI Assistant</span>
      </div>
      
      <h3 className="text-2xl font-semibold text-green-400 mt-2 mb-3">Find Your Perfect GPU</h3>
      
      <p className="text-sm text-muted-foreground mb-6">
        Tell us what you need and our AI will recommend the best options
      </p>
    </div>
  );
};

export default TileHeader;
