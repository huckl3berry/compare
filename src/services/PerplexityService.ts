
export const getPerplexityResponse = async (apiKey: string, context: any) => {
  try {
    // Format the data in a way that's easier for the model to process
    const formattedGPUs = context.availableGPUs.map((gpu: any) => ({
      provider: gpu.provider,
      model: gpu.gpuModel,
      vram: gpu.vramGB,
      pricePerHour: gpu.pricePerHour,
      pricePerGBVram: gpu.pricePerGBVram,
      region: gpu.region
    }));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a GPU recommendation assistant that provides concise recommendations.
            
            Analyze this user request: "${context.userQuery}"
            
            Recommend 2-4 different GPU models that would work well for their needs. For each model:
            1. Explain briefly why it's a good fit (1 sentence)
            2. Mention the specific model name clearly
            
            Format each recommendation as a separate paragraph.
            Be focused and concise.`
          },
          {
            role: 'user',
            content: `Here are the available GPUs to choose from: ${JSON.stringify(formattedGPUs)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to get response from Perplexity: ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Perplexity:', error);
    throw error;
  }
};
