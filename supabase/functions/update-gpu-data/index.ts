
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { FirecrawlService } from "../firecrawl/firecrawl-service.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key (needed to bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request payload
    const { force = false, providers = [] } = await req.json();
    
    console.log(`Received update request with force=${force} and providers:`, providers);
    
    // Get list of providers to update
    let providersToUpdate = providers;
    if (providersToUpdate.length === 0) {
      // If no providers specified, check all providers that haven't been updated in the last 24 hours
      const { data: outdatedProviders, error: logError } = await supabase
        .from('provider_scrape_log')
        .select('provider')
        .lt('last_scraped', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (logError) {
        throw new Error(`Error fetching outdated providers: ${logError.message}`);
      }
      
      if (outdatedProviders && outdatedProviders.length > 0) {
        providersToUpdate = outdatedProviders.map(p => p.provider);
      } else if (force) {
        // If force=true and no outdated providers, get all providers from config
        const firecrawlService = new FirecrawlService();
        providersToUpdate = firecrawlService.getProviderList();
      } else {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'No providers need updating',
            updated: 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    console.log(`Updating ${providersToUpdate.length} providers: ${providersToUpdate.join(', ')}`);
    
    // Initialize FirecrawlService
    const firecrawlService = new FirecrawlService();
    const results = {};
    let updatedCount = 0;
    
    // Process providers sequentially
    for (const provider of providersToUpdate) {
      try {
        console.log(`Scraping data for provider: ${provider}`);
        const scrapeResult = await firecrawlService.scrapeProvider(provider);
        
        if (scrapeResult.success && scrapeResult.data) {
          // Save data to database
          const gpuData = scrapeResult.data;
          console.log(`Saving ${gpuData.length} GPU items for ${provider}`);
          
          // Delete existing data for this provider first
          const { error: deleteError } = await supabase
            .from('gpu_provider_data')
            .delete()
            .eq('provider', provider);
            
          if (deleteError) {
            throw new Error(`Error deleting existing data for ${provider}: ${deleteError.message}`);
          }
          
          // Insert new data
          const { error: insertError } = await supabase
            .from('gpu_provider_data')
            .insert(gpuData.map(item => ({
              provider: item.provider,
              gpu_model: item.gpuModel,
              vram_gb: item.vramGB,
              price_per_hour: item.pricePerHour,
              price_per_gb_vram: item.pricePerGBVram,
              region: item.region,
              scrape_timestamp: item.scrapeTimestamp
            })));
            
          if (insertError) {
            throw new Error(`Error inserting data for ${provider}: ${insertError.message}`);
          }
          
          // Update the scrape log
          const { error: logError } = await supabase
            .from('provider_scrape_log')
            .upsert({ 
              provider, 
              last_scraped: new Date().toISOString() 
            });
            
          if (logError) {
            throw new Error(`Error updating scrape log for ${provider}: ${logError.message}`);
          }
          
          results[provider] = { success: true, count: gpuData.length };
          updatedCount++;
        } else {
          results[provider] = { 
            success: false, 
            error: scrapeResult.error || 'Unknown error' 
          };
        }
      } catch (error) {
        console.error(`Error updating ${provider}:`, error);
        results[provider] = { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
      
      // Add a small delay to avoid overwhelming APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        updated: updatedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-gpu-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
