
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useChatbot } from '@/hooks/useChatbot';
import ChatHeader from './chatbot/ChatHeader';
import ChatMessageList from './chatbot/ChatMessageList';
import ChatInput from './chatbot/ChatInput';
import SettingsDialog from './chatbot/SettingsDialog';

interface ChatbotProps {
  onFilterRecommendation: (filters: any) => void;
  gpuData: any[];
  onClose: () => void;
}

const GPUChatbot: React.FC<ChatbotProps> = ({ onFilterRecommendation, gpuData, onClose }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { messages, handleSendMessage, apiKey, setApiKey } = useChatbot(onFilterRecommendation, gpuData);
  
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('perplexityApiKey', key);
  };

  return (
    <Card className="shadow-lg border-2 border-green-500/50 h-full bg-gradient-to-br from-card via-green-950/10 to-muted/90 backdrop-blur-sm">
      <div className="absolute -top-3 -right-3 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onClose}
        >
          ×
        </Button>
      </div>
      
      <CardHeader className="text-center pb-2">
        <ChatHeader />
        
        <SettingsDialog 
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex flex-col h-[400px]">
          <ChatMessageList messages={messages} />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            hasApiKey={!!apiKey}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GPUChatbot;
