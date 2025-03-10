
import { supabase } from "@/integrations/supabase/client";
import { 
  ScrapeResponse, 
  ProviderScrapeConfig,
  CrawlStatusResponse,
  CrawlResultsResponse,
  CrawlResult
} from '../types';
import { FirecrawlCore, makeFirecrawlAPIRequest } from './core';

/**
 * Functions for crawling websites with Firecrawl
 */
export class FirecrawlCrawler {
  /**
   * Call the Supabase Edge Function to perform crawling
   * This is a more comprehensive approach that follows links
   */
  static async crawlURL(config: ProviderScrapeConfig): Promise<ScrapeResponse> {
    try {
      console.log(`Using SDK to crawl ${config.url}`);
      
      // Try SDK call first for crawling
      try {
        const app = FirecrawlCore.getFirecrawlApp();
        
        const response = await app.crawlUrl(config.url, {
          limit: 10, // Crawl up to 10 pages
          scrapeOptions: {
            formats: ['html'],
            waitFor: 5000, // Wait up to 5 seconds for each page
          }
        });
        
        if (!response.success) {
          // Check if 'error' exists using type guard
          const errorMsg = 'error' in response ? response.error : 'Unknown error';
          throw new Error(`SDK crawl failed: ${errorMsg}`);
        }
        
        return {
          success: true,
          data: response
        };
      } catch (sdkError) {
        console.error(`SDK crawling error:`, sdkError);
        console.log('Falling back to edge function for crawling');
        
        // Fall back to edge function
        const { data, error } = await supabase.functions.invoke('firecrawl', {
          body: {
            action: 'crawl',
            url: config.url,
            waitFor: 5000,
            limit: 10 // Crawl up to 10 pages
          }
        });
        
        if (error) {
          console.error(`Error from edge function:`, error);
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        if (!data || data.error) {
          console.error(`Failed to crawl:`, data?.error || 'Unknown error');
          throw new Error(`Crawling failed: ${data?.error || 'Unknown error'}`);
        }
        
        return {
          success: true,
          data: data.data
        };
      }
    } catch (error) {
      console.error(`Error in crawling:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Check the status of a crawl operation
   */
  static async checkCrawlStatus(id: string): Promise<CrawlStatusResponse> {
    return makeFirecrawlAPIRequest<CrawlStatusResponse>('/crawl/status', { id });
  }

  /**
   * Get the results of a completed crawl operation
   */
  static async getCrawlResults(id: string): Promise<CrawlResult[]> {
    try {
      const response = await makeFirecrawlAPIRequest<CrawlResultsResponse>('/crawl/results', { id });
      
      if ('results' in response) {
        return response.results;
      } else {
        // Use safer type assertion
        const errorResponse = response as unknown as { error?: string };
        const errorMessage = errorResponse && typeof errorResponse === 'object' && 'error' in errorResponse 
          ? String(errorResponse.error) 
          : 'Failed to fetch crawl results';
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error getting crawl results:', error);
      throw error;
    }
  }
}
