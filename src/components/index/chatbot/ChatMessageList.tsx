
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  loading?: boolean;
}

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/f91d6870-ac45-47f6-bb3f-aa989dfdf54c.png" 
            alt="Commune AI Logo" 
            className="h-32 w-32 object-contain opacity-80 transition-opacity" 
          />
        </div>
      )}
      
      {messages.map((message) => (
        <ChatMessage 
          key={message.id}
          content={message.content}
          sender={message.sender}
          loading={message.loading}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
