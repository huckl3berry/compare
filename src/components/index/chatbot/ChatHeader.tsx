
import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
        <MessageSquare className="h-3.5 w-3.5 mr-1" />
        <span>AI Assistant</span>
      </div>
      <h3 className="text-2xl font-semibold text-green-400 mt-2 mb-1">Find Your Perfect GPU</h3>
      <p className="text-sm text-muted-foreground">
        Tell us what you need and our AI will recommend the best options
      </p>
    </div>
  );
};

export default ChatHeader;
