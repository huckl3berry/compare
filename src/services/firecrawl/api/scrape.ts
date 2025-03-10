
import { supabase } from "@/integrations/supabase/client";
import { ScrapeResponse, ScrapeOptions, ProviderScrapeConfig } from '../types';
import { FirecrawlCore, makeFirecrawlAPIRequest } from './core';

/**
 * Functions for scraping websites with Firecrawl
 */
export class FirecrawlScraper {
  /**
   * Test scraping a simple page directly with the SDK
   */
  static async testScrape(url: string): Promise<ScrapeResponse> {
    try {
      console.log(`Testing scrape for: ${url}`);
      
      // Try direct SDK call first
      try {
        console.log('Attempting SDK scrape call to Firecrawl');
        const app = FirecrawlCore.getFirecrawlApp();
        const response = await app.scrapeUrl(url, {
          formats: ['markdown', 'html']
        });
        
        if (!response.success) {
          throw new Error(`SDK scrape failed: ${response.error}`);
        }
        
        console.log('SDK scrape call successful');
        return {
          success: true,
          data: response
        };
      } catch (directError) {
        console.error('SDK scrape call failed:', directError);
        console.log('Falling back to edge function');
        
        // Fall back to edge function
        const { data, error } = await supabase.functions.invoke('firecrawl', {
          body: {
            action: 'scrape',
            url: url
          }
        });
        
        if (error) {
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        if (!data || data.error) {
          throw new Error(`Scraping failed: ${data?.error || 'Unknown error'}`);
        }
        
        return {
          success: true,
          data: data.data
        };
      }
    } catch (error) {
      console.error(`Error in test scraping:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Call the Supabase Edge Function to perform the scraping
   */
  static async scrapeURL(config: ProviderScrapeConfig): Promise<ScrapeResponse> {
    try {
      // Try SDK call first
      try {
        console.log(`Using SDK to scrape ${config.url}`);
        const app = FirecrawlCore.getFirecrawlApp();
        
        const response = await app.scrapeUrl(config.url, {
          formats: ['html'],
          waitFor: 5000 // Use a number (milliseconds) for timeout
        });
        
        if (!response.success) {
          throw new Error(`SDK scrape failed: ${response.error}`);
        }
        
        return {
          success: true,
          data: response
        };
      } catch (sdkError) {
        console.error(`SDK scraping error:`, sdkError);
        console.log('Falling back to edge function');
        
        // Fall back to edge function with enhanced error handling
        const { data, error } = await supabase.functions.invoke('firecrawl', {
          body: {
            action: 'scrape',
            url: config.url,
            selectors: config.selectors, // Keep selectors for edge function
            waitFor: 5000, // Use a number (milliseconds) for timeout
            waitForSelector: config.waitForSelector // Pass waitForSelector separately
          }
        });
        
        if (error) {
          console.error(`Error from edge function:`, error);
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        if (!data || data.error) {
          console.error(`Failed to scrape:`, data?.error || 'Unknown error');
          throw new Error(`Scraping failed: ${data?.error || 'Unknown error'}`);
        }
        
        return {
          success: true,
          data: data.data
        };
      }
    } catch (error) {
      console.error(`Error in scraping:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Perform a scrape operation against an arbitrary website
   */
  static async scrapeWebsite(
    url: string,
    selectors: Record<string, string>,
    options: ScrapeOptions = {}
  ): Promise<ScrapeResponse> {
    const params: Record<string, string> = {
      url,
      ...Object.entries(options).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>),
    };

    return makeFirecrawlAPIRequest<ScrapeResponse>('/scrape', params);
  }
}
