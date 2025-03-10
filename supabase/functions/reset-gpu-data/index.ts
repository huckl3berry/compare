
// This function can be used to reset the database and populate it with fresh data
// from our defined list of providers
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { FirecrawlService } from "../firecrawl/firecrawl-service.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const firecrawl = new FirecrawlService();
    const providers = firecrawl.getProviderList();
    
    console.log(`Resetting data for ${providers.length} valid providers`);
    
    // Clear existing data
    const { error: deleteGpuError } = await supabase
      .from('gpu_provider_data')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Safety check
    
    if (deleteGpuError) {
      console.error('Error deleting GPU data:', deleteGpuError);
      throw deleteGpuError;
    }
    
    // Clear provider log
    const { error: deleteLogError } = await supabase
      .from('provider_scrape_log')
      .delete()
      .neq('provider', 'NON_EXISTENT_PROVIDER'); // Safety check
    
    if (deleteLogError) {
      console.error('Error deleting scrape log:', deleteLogError);
      throw deleteLogError;
    }
    
    // Scrape all valid providers
    const updatedProviders = [];
    
    for (const provider of providers) {
      console.log(`Scraping provider: ${provider}`);
      const result = await firecrawl.scrapeProvider(provider);
      
      if (result.success && result.data) {
        // Insert GPU data
        const { error: insertError } = await supabase
          .from('gpu_provider_data')
          .insert(result.data);
          
        if (insertError) {
          console.error(`Error inserting data for ${provider}:`, insertError);
          continue;
        }
        
        // Update scrape log
        const { error: logError } = await supabase
          .from('provider_scrape_log')
          .insert({ provider, last_scraped: new Date().toISOString() });
          
        if (logError) {
          console.error(`Error updating log for ${provider}:`, logError);
          continue;
        }
        
        updatedProviders.push(provider);
      } else {
        console.error(`Failed to scrape ${provider}:`, result.error || 'Unknown error');
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database reset and repopulated successfully',
        updated: updatedProviders.length,
        providers: updatedProviders
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in reset-gpu-data function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
