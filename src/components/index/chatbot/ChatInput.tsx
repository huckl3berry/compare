
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Key } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  hasApiKey, 
  onOpenSettings 
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="mt-auto">
      <p className="text-sm text-green-400/80 font-medium text-center mb-4">Powered by Commune AI</p>
      
      <div className="flex items-center space-x-2 pt-4 border-t">
        {!hasApiKey && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onOpenSettings}
            title="Set API Key"
          >
            <Key className="h-4 w-4" />
          </Button>
        )}
        <Input 
          ref={inputRef}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleKeyDown}
          placeholder="Describe your GPU needs... (e.g., 'I need an A100 for machine learning')"
          className="flex-1"
        />
        <Button 
          onClick={handleSubmit} 
          size="icon"
          disabled={!input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
