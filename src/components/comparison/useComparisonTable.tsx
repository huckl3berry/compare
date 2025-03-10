
import { useMemo, useState } from 'react';

export type SortKey = 'provider' | 'gpuModel' | 'vramGB' | 'pricePerHour' | 'pricePerGBVram' | 'region';

interface ComparisonData {
  id: number;
  provider: string;
  providerUrl?: string;
  gpuModel: string;
  vramGB: number;
  pricePerHour: number;
  pricePerGBVram: number;
  region: string;
  scrapeTimestamp: string;
}

export const useComparisonTable = (data: ComparisonData[]) => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  }>({
    key: 'vramGB',
    direction: 'desc',
  });
  
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'compare'>('all');
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  
  const providers = useMemo(() => {
    const uniqueProviders = Array.from(new Set(data.map(item => item.provider)));
    return uniqueProviders;
  }, [data]);

  const sortedData = useMemo(() => {
    const sortableData = [...data];
    
    const filteredData = viewMode === 'compare' && selectedProviders.length > 0
      ? sortableData.filter(item => selectedProviders.includes(item.provider))
      : sortableData;
    
    if (sortConfig.key === 'vramGB' && sortConfig.direction === 'desc') {
      const vramGroups = new Map<number, ComparisonData[]>();
      
      filteredData.forEach(item => {
        if (!vramGroups.has(item.vramGB)) {
          vramGroups.set(item.vramGB, []);
        }
        vramGroups.get(item.vramGB)?.push(item);
      });
      
      vramGroups.forEach(group => {
        group.sort((a, b) => a.pricePerHour - b.pricePerHour);
      });
      
      const vramSizes = [...vramGroups.keys()].sort((a, b) => b - a);
      
      return vramSizes.flatMap(vram => vramGroups.get(vram) || []);
    } else {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      
      return filteredData;
    }
  }, [data, sortConfig, selectedProviders, viewMode]);

  const requestSort = (key: SortKey) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const toggleProviderSelection = (provider: string) => {
    setSelectedProviders(prev => {
      if (prev.includes(provider)) {
        return prev.filter(p => p !== provider);
      } else {
        return [...prev, provider];
      }
    });
  };
  
  const bestValues = useMemo(() => {
    const currentData = viewMode === 'compare' && selectedProviders.length > 0
      ? data.filter(item => selectedProviders.includes(item.provider))
      : data;
      
    if (currentData.length === 0) return {};
    
    return {
      lowestPricePerHour: Math.min(...currentData.map(item => item.pricePerHour)),
      lowestPricePerGBVram: Math.min(...currentData.map(item => item.pricePerGBVram)),
      highestVRam: Math.max(...currentData.map(item => item.vramGB))
    };
  }, [data, selectedProviders, viewMode]);

  const handleViewChange = (value: string) => {
    setViewMode(value as 'all' | 'compare');
    setIsTableExpanded(true);
  };

  const toggleTableExpansion = () => {
    setIsTableExpanded(!isTableExpanded);
  };
  
  return {
    sortConfig,
    sortedData,
    providers,
    selectedProviders,
    viewMode,
    isTableExpanded,
    bestValues,
    requestSort,
    toggleProviderSelection,
    handleViewChange,
    toggleTableExpansion
  };
};
