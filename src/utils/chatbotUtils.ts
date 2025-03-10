
import { GPUData } from '@/components/index/chatbot/types';

/**
 * Extracts GPU model names from an AI response
 */
export const extractGPUModels = (response: string): string[] => {
  const gpuModels = [
    'A100', 'H100', 'A6000', 'A40', 'A10', 'V100', 'P100', 'T4', 'RTX',
    'A800', 'A30', 'L4', 'L40', 'H200'
  ];
  
  const foundModels: string[] = [];
  
  for (const model of gpuModels) {
    if (response.includes(model)) {
      foundModels.push(model);
    }
  }
  
  return foundModels;
};

/**
 * Finds the cheapest provider for a specific GPU model
 */
export const findCheapestProviderForModel = (gpuData: GPUData[], model: string): GPUData | null => {
  const filteredData = gpuData.filter(gpu => gpu.gpuModel.includes(model));
  
  if (filteredData.length === 0) return null;
  
  return filteredData.sort((a, b) => a.pricePerHour - b.pricePerHour)[0];
};

/**
 * Enhances AI response with provider links and pricing information
 */
export const enhanceResponseWithLinks = (response: string, gpuData: GPUData[]): string => {
  const gpuModels = extractGPUModels(response);
  let enhancedResponse = response;
  
  for (const model of gpuModels) {
    const cheapestOption = findCheapestProviderForModel(gpuData, model);
    
    if (cheapestOption) {
      const providerLink = cheapestOption.providerUrl 
        ? `<a href="${cheapestOption.providerUrl}" target="_blank" class="text-green-400 hover:text-green-300 underline">${cheapestOption.provider}</a>` 
        : cheapestOption.provider;
        
      const priceInfo = `\n\n${model} (${cheapestOption.vramGB}GB VRAM) is available from ${providerLink} at $${cheapestOption.pricePerHour.toFixed(4)}/hour.`;
      
      if (!enhancedResponse.includes(priceInfo)) {
        const modelPattern = new RegExp(`(${model}[^.]*)\.`);
        if (modelPattern.test(enhancedResponse)) {
          enhancedResponse = enhancedResponse.replace(modelPattern, `$1.${priceInfo}`);
        } else {
          enhancedResponse += priceInfo;
        }
      }
    }
  }
  
  return enhancedResponse;
};
