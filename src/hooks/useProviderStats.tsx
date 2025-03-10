
import { useState, useEffect } from 'react';
import { GPUData, GPUDataService } from '@/services/GPUDataService';

export const useProviderStats = (gpuData: GPUData[]) => {
  const [providers, setProviders] = useState<string[]>([]);
  const [providerStats, setProviderStats] = useState<any[]>([]);

  useEffect(() => {
    if (gpuData.length === 0) return;
    
    const uniqueProviders = [...new Set(gpuData.map(item => item.provider))];
    setProviders(uniqueProviders);
    
    const stats = uniqueProviders.map(provider => {
      const providerData = gpuData.filter(item => item.provider === provider);
      const bestPrice = Math.min(...providerData.map(item => item.pricePerHour));
      const bestPricePerGB = Math.min(...providerData.map(item => item.pricePerGBVram));
      
      return {
        provider,
        bestPrice,
        bestPricePerGB,
        gpuCount: providerData.length,
        websiteUrl: GPUDataService.getProviderUrl(provider)
      };
    });
    
    stats.sort((a, b) => a.bestPricePerGB - b.bestPricePerGB);
    setProviderStats(stats);
  }, [gpuData]);

  return {
    providers,
    providerStats
  };
};
