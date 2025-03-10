
import { GPUDataService } from '@/services/GPUDataService';

export interface PriceData {
  provider: string;
  gpuModel: string;
  vramGB: number;
  pricePerHour: number;
  pricePerGBVram: number;
}

export interface ChartDataItem {
  name: string;
  provider: string;
  value: number;
  vram: number;
}

export const processChartData = (
  data: PriceData[], 
  chartType: 'price' | 'price-per-gb'
): ChartDataItem[] => {
  // Get top 10 most efficient options by price per GB VRAM
  const sortedData = [...data].sort((a, b) => {
    if (chartType === 'price-per-gb') {
      return a.pricePerGBVram - b.pricePerGBVram;
    } else {
      return a.pricePerHour - b.pricePerHour;
    }
  });
  
  // Take top 10 results
  return sortedData.slice(0, 10).map(item => ({
    name: `${item.gpuModel} (${item.vramGB}GB)`,
    provider: item.provider,
    value: chartType === 'price-per-gb' ? item.pricePerGBVram : item.pricePerHour,
    vram: item.vramGB
  }));
};

export const getProviderUrl = (provider: string): string => {
  // Get provider URL
  const providerMap: Record<string, string> = {
    'Digital Ocean': 'https://www.digitalocean.com/products/gpu-droplets',
    'Runpod': 'https://www.runpod.io/pricing',
    'Vast': 'https://vast.ai/pricing',
    'Valdi': 'https://www.valdi.ai/compute',
    'Coreweave': 'https://www.coreweave.com/pricing',
    'Nebius': 'https://nebius.com/prices',
    'Tencent Cloud': 'https://www.tencentcloud.com/products/gpu'
  };
  
  return providerMap[provider] || '';
};
