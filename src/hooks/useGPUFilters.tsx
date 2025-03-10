
import { useState, useEffect } from 'react';
import { GPUData } from '@/services/GPUDataService';

export interface FilterState {
  vramRange: [number, number];
  priceRange: [number, number];
  searchTerm: string;
  selectedProviders: string[];
  sortBy: 'price' | 'price-per-gb' | 'vram';
  sortDirection: 'asc' | 'desc';
}

export const useGPUFilters = (gpuData: GPUData[]) => {
  const [filteredData, setFilteredData] = useState<GPUData[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    vramRange: [0, 80] as [number, number],
    priceRange: [0, 5] as [number, number],
    searchTerm: '',
    selectedProviders: [] as string[],
    sortBy: 'vram' as 'price' | 'price-per-gb' | 'vram',
    sortDirection: 'desc' as 'asc' | 'desc'
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    console.log('Applying new filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    // Fix potential issues with empty arrays or undefined values in filters
    let filtered = [...gpuData];
    
    // Apply VRAM filter
    if (filters.vramRange && filters.vramRange.length === 2) {
      filtered = filtered.filter(item => 
        item.vramGB >= filters.vramRange[0] && 
        item.vramGB <= filters.vramRange[1]
      );
    }
    
    // Apply price filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      filtered = filtered.filter(item => 
        item.pricePerHour >= filters.priceRange[0] && 
        item.pricePerHour <= filters.priceRange[1]
      );
    }
    
    // Apply provider filter
    if (filters.selectedProviders && filters.selectedProviders.length > 0) {
      filtered = filtered.filter(item => 
        filters.selectedProviders.includes(item.provider)
      );
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.provider && item.provider.toLowerCase().includes(searchLower)) ||
        (item.gpuModel && item.gpuModel.toLowerCase().includes(searchLower)) ||
        (item.region && item.region.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (filters.sortBy === 'vram' && filters.sortDirection === 'desc') {
      // Special sorting for VRAM in descending order
      const vramGroups = new Map<number, GPUData[]>();
      
      filtered.forEach(item => {
        if (!vramGroups.has(item.vramGB)) {
          vramGroups.set(item.vramGB, []);
        }
        vramGroups.get(item.vramGB)?.push(item);
      });
      
      vramGroups.forEach(group => {
        group.sort((a, b) => a.pricePerHour - b.pricePerHour);
      });
      
      const vramSizes = [...vramGroups.keys()].sort((a, b) => b - a);
      
      filtered = vramSizes.flatMap(vram => vramGroups.get(vram) || []);
    } else {
      // Standard sorting for other cases
      filtered.sort((a, b) => {
        let aValue = 0, bValue = 0;
        
        switch (filters.sortBy) {
          case 'price':
            aValue = a.pricePerHour;
            bValue = b.pricePerHour;
            break;
          case 'price-per-gb':
            aValue = a.pricePerGBVram;
            bValue = b.pricePerGBVram;
            break;
          case 'vram':
            aValue = a.vramGB;
            bValue = b.vramGB;
            break;
          default:
            aValue = a.pricePerGBVram;
            bValue = b.pricePerGBVram;
        }
        
        return filters.sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
    }
    
    // Debug logging
    console.log(`Applied filters resulted in ${filtered.length} results from ${gpuData.length} total GPUs`);
    
    setFilteredData(filtered);
  }, [gpuData, filters]);

  return {
    filteredData,
    filters,
    handleFilterChange
  };
};
