
import React from 'react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'bot';
  loading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, loading }) => {
  return (
    <div 
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          sender === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150" />
          </div>
        ) : (
          <div 
            className="whitespace-pre-line chat-message"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
