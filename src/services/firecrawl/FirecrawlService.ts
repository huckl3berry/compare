
import { ScrapeResponse } from './types';
import { providerConfigs } from './providerConfigs';
import { processScrapedData } from './dataProcessing';
import { FirecrawlAPI } from './api';

/**
 * Service class for interacting with Firecrawl functionality
 */
export class FirecrawlService {
  /**
   * Get the API key from storage or use the default
   */
  static getApiKey(): string {
    return FirecrawlAPI.getApiKey();
  }

  /**
   * Test if an API key is valid
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    return FirecrawlAPI.testApiKey(apiKey);
  }

  /**
   * Simple test function to scrape a basic page
   */
  static async testScrape(): Promise<ScrapeResponse> {
    try {
      console.log('Testing basic scrape with Firecrawl API');
      const testUrl = "https://example.com";
      
      const result = await FirecrawlAPI.callTestScrape(testUrl);
      
      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('Error in test scrape:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Crawl a specific provider's website
   */
  static async scrapeProvider(providerName: string): Promise<ScrapeResponse> {
    const normalizedProviderName = providerName.toLowerCase().replace(/\s+/g, '');
    const config = providerConfigs[normalizedProviderName];
    
    if (!config) {
      return { 
        success: false, 
        error: `No configuration found for provider: ${providerName}` 
      };
    }
    
    try {
      console.log(`Starting data collection for ${providerName} at ${config.url}`);
      
      // First try to crawl the provider's site to get more comprehensive data
      console.time(`crawl-${providerName}`);
      console.log(`Attempting to crawl ${providerName}...`);
      
      const crawlResult = await FirecrawlAPI.callCrawlingFunction(config);
      console.timeEnd(`crawl-${providerName}`);
      
      if (crawlResult.success && crawlResult.data) {
        console.log(`Crawl successful for ${providerName}, processing data...`);
        const processedData = processScrapedData(crawlResult.data, providerName);
        
        // Check if we got enough data from crawling
        if (processedData.length >= 5) {
          console.log(`Found ${processedData.length} GPU models from crawling ${providerName}`);
          return {
            success: true,
            data: processedData
          };
        }
        
        console.log(`Crawl returned insufficient data (${processedData.length} models), falling back to scrape...`);
      } else {
        console.log(`Crawl failed for ${providerName}: ${crawlResult.error}, falling back to scrape...`);
      }
      
      // Fall back to scrape if crawl failed or returned insufficient data
      console.time(`scrape-${providerName}`);
      console.log(`Attempting to scrape ${providerName}...`);
      
      const scrapeResult = await FirecrawlAPI.callScrapingFunction(config);
      console.timeEnd(`scrape-${providerName}`);
      
      console.log(`Scrape result for ${providerName}:`, {
        success: scrapeResult.success,
        error: scrapeResult.error,
        dataType: scrapeResult.data ? typeof scrapeResult.data : 'none',
        dataLength: scrapeResult.data && typeof scrapeResult.data === 'object' ? 
          (Array.isArray(scrapeResult.data) ? scrapeResult.data.length : Object.keys(scrapeResult.data).length) : 0
      });
      
      if (scrapeResult.success && scrapeResult.data) {
        console.log(`Processing scraped data for ${providerName}`);
        
        // Process the scraped data to match our expected format
        const processedData = processScrapedData(scrapeResult.data, providerName);
        console.log(`Processed data for ${providerName}:`, processedData);
        return {
          success: true,
          data: processedData
        };
      } else {
        console.error(`Failed to scrape ${providerName}:`, scrapeResult.error);
        // Use fallback data when scraping fails
        console.log(`Using fallback data for ${providerName}`);
        const fallbackData = processScrapedData(null, providerName);
        return {
          success: true,
          data: fallbackData,
          warning: `Used fallback data due to scraping error: ${scrapeResult.error}`
        };
      }
    } catch (error) {
      console.error(`Error collecting data for ${providerName}:`, error);
      
      // Use fallback data for this provider
      console.log(`Using fallback data for ${providerName} due to error`);
      const fallbackData = processScrapedData(null, providerName);
      return {
        success: true,
        data: fallbackData,
        warning: `Used fallback data due to error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Crawl all configured providers
   */
  static async scrapeAllProviders(): Promise<Record<string, ScrapeResponse>> {
    const results: Record<string, ScrapeResponse> = {};
    const providerList = Object.keys(providerConfigs);
    
    console.log(`Starting to process data for ${providerList.length} providers: ${providerList.join(', ')}`);
    
    // Process providers sequentially to avoid overwhelming the API
    for (const provider of providerList) {
      try {
        console.log(`Starting data collection for provider: ${provider}`);
        results[provider] = await this.scrapeProvider(provider);
        console.log(`Completed data collection for provider: ${provider}, success: ${results[provider].success}`);
        
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing ${provider}:`, error);
        results[provider] = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
    
    const successfulProviders = Object.entries(results)
      .filter(([_, result]) => result.success)
      .map(([provider]) => provider);
    
    console.log(`Completed processing all providers. Successful: ${successfulProviders.join(', ')}`);
    return results;
  }
}
