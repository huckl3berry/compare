
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FirecrawlAPI } from "./firecrawl/api";

export interface GPUData {
  id: number;
  provider: string;
  gpuModel: string;
  vramGB: number;
  pricePerHour: number;
  pricePerGBVram: number;
  region: string;
  scrapeTimestamp: string;
  providerUrl?: string;
}

export class GPUDataService {
  /**
   * Get all GPU data from the database
   */
  static async getAllGPUData(): Promise<GPUData[]> {
    try {
      // Get data from database
      const { data, error } = await supabase
        .from('gpu_provider_data')
        .select('*');
        
      if (error) {
        console.error('Error fetching GPU data:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No data in database, will need to trigger initial data fetch');
        return [];
      }
      
      // Transform database data to match the GPUData interface
      return data.map((item, index) => ({
        id: index + 1,
        provider: item.provider,
        gpuModel: item.gpu_model,
        vramGB: item.vram_gb,
        pricePerHour: item.price_per_hour,
        pricePerGBVram: item.price_per_gb_vram,
        region: item.region,
        scrapeTimestamp: item.scrape_timestamp,
        providerUrl: this.getProviderUrl(item.provider)
      }));
    } catch (error) {
      console.error('Error getting GPU data:', error);
      return []; // Return empty array instead of throwing error to prevent app crashes
    }
  }
  
  /**
   * Get the URL for a provider's website
   */
  static getProviderUrl(provider: string): string {
    const providerMap: Record<string, string> = {
      // Update DatabaseMart URL to the correct one
      'DatabaseMart': 'https://www.databasemart.com/gpu-server',
      'Digital Ocean': 'https://www.digitalocean.com/products/gpu-droplets',
      'Runpod': 'https://www.runpod.io/pricing',
      'Vast': 'https://vast.ai/pricing',
      'Valdi': 'https://www.valdi.ai/compute',
      'Coreweave': 'https://www.coreweave.com/pricing',
      'Nebius': 'https://nebius.com/prices',
      'Tencent Cloud': 'https://www.tencentcloud.com/products/gpu'
    };
    
    return providerMap[provider] || '';
  }
  
  /**
   * Check if any provider needs to be updated
   */
  static async checkForUpdates(): Promise<{ needsUpdate: boolean; providers: string[] }> {
    try {
      // Get all providers that haven't been updated in the last 24 hours
      const { data, error } = await supabase
        .from('provider_scrape_log')
        .select('provider, last_scraped')
        .lt('last_scraped', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
      if (error) {
        console.error('Error checking for updates:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return { needsUpdate: false, providers: [] };
      }
      
      // Return list of providers that need to be updated
      return {
        needsUpdate: true,
        providers: data.map(item => item.provider)
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { needsUpdate: false, providers: [] };
    }
  }
  
  /**
   * Trigger the edge function to update GPU data
   * This is only used internally for the automatic daily update
   */
  static async triggerDataUpdate(force = false, specificProviders: string[] = []): Promise<GPUData[] | null> {
    try {
      // Only show toast for automatic background updates if providers are specified
      if (specificProviders.length > 0 && !force) {
        toast.info('Updating GPU pricing data...', {
          duration: 3000,
        });
      }
      
      console.log(`Calling update-gpu-data edge function with force=${force}, providers:`, specificProviders);
      
      // Call the edge function to update the data
      const { data, error } = await supabase.functions.invoke('update-gpu-data', {
        body: {
          force,
          providers: specificProviders
        }
      });
      
      if (error) {
        console.error('Error invoking edge function:', error);
        throw error;
      }
      
      console.log('Data update response:', data);
      
      if (data.success) {
        if (specificProviders.length > 0 && data.updated > 0) {
          toast.success(`Updated pricing for ${data.updated} providers`);
        }
        
        // Fetch the updated data from the database
        return await this.getAllGPUData();
      } else {
        console.error('Edge function returned failure:', data.error);
        throw new Error(data.error || 'Unknown error updating data');
      }
    } catch (error) {
      console.error('Error triggering data update:', error);
      throw error; // Re-throw to allow handling by the caller
    }
  }

  /**
   * Force an immediate update of all GPU data regardless of when it was last updated
   * This is intended to be used manually by users who want fresh data immediately
   */
  static async forceUpdateAllData(): Promise<GPUData[] | null> {
    try {
      console.log('Forcing update of all GPU pricing data');
      
      // Call the edge function with force=true to update all data
      return await this.triggerDataUpdate(true);
    } catch (error) {
      console.error('Error forcing data update:', error);
      throw error; // Re-throw to allow handling by the caller
    }
  }
}
