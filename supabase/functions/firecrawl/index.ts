
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import the Firecrawl SDK
import FirecrawlApp from "https://esm.sh/@mendable/firecrawl-js";

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
    // Use the updated API key 
    const apiKey = "fc-00658eef64c34089959db3db94a198f2";

    // Parse request payload with error handling
    let payload;
    try {
      payload = await req.json();
      console.log('Request payload:', JSON.stringify(payload, null, 2));
    } catch (e) {
      console.error('Failed to parse request JSON:', e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON payload',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { action, url, selectors = {}, waitFor = 5000, waitForSelector, limit = 10 } = payload;

    if (!url) {
      console.error('Missing URL in request');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'URL is required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Processing ${action} request for ${url} with Firecrawl SDK`);
    
    // Initialize the Firecrawl SDK with the updated API key
    const firecrawlApp = new FirecrawlApp({ apiKey });
    
    // Handle different action types
    let result;
    if (action === 'crawl') {
      console.log('Performing crawl operation with limit:', limit);
      result = await firecrawlApp.crawlUrl(url, {
        limit: typeof limit === 'number' ? limit : 10, // Default to 10 pages
        scrapeOptions: {
          formats: ['html'],
          waitFor: typeof waitFor === 'string' ? 5000 : waitFor,
        }
      });
      
      // Log the crawl results
      console.log(`Crawl completed with ${result.pages?.length || 0} pages`);
      
      // If we have selectors, try to process the results to extract data
      if (Object.keys(selectors).length > 0 && result.pages) {
        console.log('Processing crawled pages with selectors');
        
        // Collect HTML content from all pages
        const allHtml = result.pages.map(page => page.html).join(' ');
        
        // Here we would process the HTML with the selectors
        // For now, add the extracted data to the result
        result.extractedData = { selectors };
      }
    } else if (action === 'scrape') {
      console.log('Performing scrape operation');
      // Set wait conditions based on selectors or waitFor
      let waitTime = typeof waitFor === 'string' ? 5000 : waitFor;
      let waitCondition = null;
      
      if (waitForSelector) {
        waitCondition = { selector: waitForSelector };
        console.log(`Setting wait condition for selector: ${waitForSelector}`);
      }
      
      // The SDK doesn't directly support 'selectors', so we handle them ourselves after scraping
      const scrapeOptions = {
        formats: ['html'],
        waitFor: waitCondition || waitTime,
        // 'selectors' is not passed directly to SDK
      };
      
      console.log('Scrape options:', JSON.stringify(scrapeOptions, null, 2));
      
      result = await firecrawlApp.scrapeUrl(url, scrapeOptions);
      
      // If successful and we have selectors, perform manual extraction
      if (result.success && Object.keys(selectors).length > 0) {
        console.log('Successfully scraped page, now processing selectors manually');
        // The HTML content will be in result.html
        // Here we would manually extract data based on selectors
        // For now, we just add the selectors to the result for debugging
        result.extractedData = { selectors };
      }
    } else {
      // Default to scrape if no action specified
      console.log('No action specified, defaulting to scrape');
      result = await firecrawlApp.scrapeUrl(url, {
        formats: ['html'],
        waitFor: typeof waitFor === 'string' ? 5000 : waitFor,
      });
    }

    // Check if the operation was successful
    if (!result.success) {
      console.error(`Firecrawl SDK returned error:`, result.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Firecrawl SDK error: ${result.error}`
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Firecrawl SDK operation successful');
    // Truncate response data for logging to avoid extremely long logs
    console.log('Response data:', JSON.stringify(result).substring(0, 500) + '...');

    // Process the result to make it safe for JSON serialization
    // This step ensures we don't send objects that can't be properly rendered in React
    const sanitizedResult = JSON.parse(JSON.stringify(result));

    // Return the response
    return new Response(
      JSON.stringify({ success: true, data: sanitizedResult }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in Firecrawl edge function:', error);
    
    // Return error response with more helpful information
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
