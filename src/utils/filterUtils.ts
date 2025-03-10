
import { extractGPUModels } from './chatbotUtils';

/**
 * Processes AI response and extracts filtering criteria
 */
export const processFiltersFromResponse = (response: string): any => {
  const filters: any = {
    vramRange: [0, 80],
    priceRange: [0, 5],
    selectedProviders: [],
    sortBy: 'price-per-gb',
    sortDirection: 'asc'
  };

  const gpuModels = extractGPUModels(response);
  if (gpuModels.length > 0) {
    filters.searchTerm = gpuModels[0];
  }

  if (response.toLowerCase().includes('high memory') || 
      response.toLowerCase().includes('large memory') ||
      response.toLowerCase().includes('high vram')) {
    filters.vramRange = [24, 80];
    filters.sortBy = 'vram';
    filters.sortDirection = 'desc';
  }
  
  if (response.toLowerCase().includes('cheap') || 
      response.toLowerCase().includes('budget') || 
      response.toLowerCase().includes('affordable')) {
    filters.sortBy = 'price';
    filters.sortDirection = 'asc';
  }

  const providers = ['runpod', 'vast', 'valdi', 'coreweave', 'digital ocean', 'nebius', 'tencent', 'databasemart'];
  for (const provider of providers) {
    if (response.toLowerCase().includes(provider.toLowerCase())) {
      filters.selectedProviders.push(provider);
    }
  }

  return filters;
};
