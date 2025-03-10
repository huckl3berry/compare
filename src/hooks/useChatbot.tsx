
import { useState } from 'react';
import { getPerplexityResponse } from '@/services/PerplexityService';
import { toast } from 'sonner';
import { extractGPUModels, findCheapestProviderForModel, enhanceResponseWithLinks } from '@/utils/chatbotUtils';
import { processFiltersFromResponse } from '@/utils/filterUtils';
import { Message, GPUData } from '@/components/index/chatbot/types';

export const useChatbot = (onFilterRecommendation: (filters: any) => void, gpuData: GPUData[]) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I can help you find the best GPU for your needs. What will you be using the GPU for? Or if you're looking for a specific GPU model, just let me know!",
      sender: 'bot'
    }
  ]);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('perplexityApiKey') || '');

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleApiRequest = async (userInput: string) => {
    if (!apiKey) {
      const key = prompt('Please enter your Perplexity API key to get personalized GPU recommendations. This will be saved in your browser.');
      if (!key) {
        throw new Error('API key is required');
      }
      setApiKey(key);
      localStorage.setItem('perplexityApiKey', key);
    }

    const context = {
      userQuery: userInput,
      availableGPUs: gpuData
    };

    return await getPerplexityResponse(apiKey, context);
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user'
    };
    addMessage(userMessage);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'bot',
      loading: true
    };
    addMessage(loadingMessage);

    try {
      // Get AI response
      const response = await handleApiRequest(input);
      
      // Enhance response with links
      const enhancedResponse = enhanceResponseWithLinks(response, gpuData);
      
      // Process filters from response
      const filters = processFiltersFromResponse(response);

      // Update loading message with response
      updateMessage(loadingMessage.id, { 
        content: enhancedResponse, 
        loading: false 
      });

      // Apply filters
      onFilterRecommendation(filters);
    } catch (error) {
      console.error('Error getting GPU recommendations:', error);
      toast.error('Failed to get GPU recommendations. Please check your API key and try again.');
      
      // Remove loading message and add error message
      removeMessage(loadingMessage.id);
      addMessage({
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your request. Please check your Perplexity API key or try again later.",
        sender: 'bot'
      });
    }
  };

  return {
    messages,
    handleSendMessage,
    apiKey,
    setApiKey
  };
};
