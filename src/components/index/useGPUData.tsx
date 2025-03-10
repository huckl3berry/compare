
import { useState, useEffect } from 'react';
import { GPUDataService, GPUData } from '@/services/GPUDataService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useGPUFilters, FilterState } from '@/hooks/useGPUFilters';
import { useProviderStats } from '@/hooks/useProviderStats';

// Change this line to use 'export type' for type re-exports
export type { FilterState } from '@/hooks/useGPUFilters';

export const useGPUData = () => {
  const { profile } = useAuth();
  const [gpuData, setGpuData] = useState<GPUData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use our refactored hooks
  const { filteredData, filters, handleFilterChange } = useGPUFilters(gpuData);
  const { providers, providerStats } = useProviderStats(gpuData);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allData = await GPUDataService.getAllGPUData();
      
      console.log(`Loaded ${allData.length} GPU offerings from database`);
      setGpuData(allData);
      
      // If no data was returned, try forcing an update to get initial data
      if (allData.length === 0) {
        console.log('No data found in database, fetching initial data...');
        toast.info('Fetching initial GPU data...');
        const initialData = await GPUDataService.triggerDataUpdate(true);
        if (initialData && initialData.length > 0) {
          console.log(`Loaded ${initialData.length} GPU offerings after initial fetch`);
          setGpuData(initialData);
        } else {
          console.error('Failed to fetch initial GPU data');
          toast.error('Failed to load GPU data');
        }
      }
      
      // Check if we need to update data based on daily scraping
      const lastScrapeCheck = localStorage.getItem('lastScrapeCheck');
      const currentDate = new Date().toDateString();
      
      // Only check for updates once per day by storing the date in localStorage
      if (!lastScrapeCheck || lastScrapeCheck !== currentDate) {
        console.log('Checking for updated pricing data...');
        localStorage.setItem('lastScrapeCheck', currentDate);
        
        const { needsUpdate, providers: outdatedProviders } = await GPUDataService.checkForUpdates();
        if (needsUpdate && outdatedProviders.length > 0) {
          console.log(`Found ${outdatedProviders.length} providers that need updating`);
          toast.info(`Updating pricing data for ${outdatedProviders.length} providers...`, {
            duration: 3000,
          });
          
          GPUDataService.triggerDataUpdate(false, outdatedProviders)
            .then(updatedData => {
              if (updatedData) {
                setGpuData(updatedData);
              }
            });
        }
      } else {
        console.log('Skipping provider update check - already checked today');
      }
    } catch (error) {
      console.error('Error fetching GPU data:', error);
      toast.error('Failed to load GPU data');
    } finally {
      setLoading(false);
    }
  };
  
  const forceUpdateData = async () => {
    if (!profile?.is_admin) {
      toast.error('You do not have permission to perform this action');
      return;
    }
    
    setLoading(true);
    try {
      toast.info('Forcing update of all GPU data...', {
        duration: 5000,
      });
      
      const updatedData = await GPUDataService.forceUpdateAllData();
      if (updatedData) {
        setGpuData(updatedData);
        toast.success('Successfully updated GPU data');
      } else {
        toast.error('Failed to update GPU data');
      }
    } catch (error) {
      console.error('Error forcing update:', error);
      toast.error('Failed to update GPU data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return {
    gpuData,
    filteredData,
    loading,
    providers,
    providerStats,
    filters,
    handleFilterChange,
    forceUpdateData
  };
};
