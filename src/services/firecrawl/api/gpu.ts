
import { supabase } from "@/integrations/supabase/client";

/**
 * Functions for updating GPU data
 */
export class FirecrawlGPU {
  /**
   * Force update of GPU data for all providers by calling the edge function
   * This bypasses the 24-hour restriction
   */
  static async forceUpdateGpuData(): Promise<boolean> {
    try {
      console.log('Forcing update for all GPU providers...');
      
      const { data, error } = await supabase.functions.invoke('update-gpu-data', {
        body: {
          force: true, // Force update regardless of last update time
          providers: [] // Empty array means update all providers
        }
      });
      
      if (error) {
        console.error('Error forcing GPU data update:', error);
        throw new Error(`Failed to force update: ${error.message}`);
      }
      
      console.log('Force update response:', data);
      
      if (data && data.success) {
        console.log(`Successfully updated ${data.updated} providers`);
        return true;
      } else {
        throw new Error('Update did not complete successfully');
      }
    } catch (error) {
      console.error('Error in force update:', error);
      return false;
    }
  }
}
