
import { ScrapeResponse, ProviderScrapeConfig } from '../types';
import { FirecrawlCore } from './core';
import { FirecrawlScraper } from './scrape';
import { FirecrawlCrawler } from './crawl';
import { FirecrawlGPU } from './gpu';

/**
 * Main API class that combines functionality from all modules
 */
export class FirecrawlAPI {
  /**
   * Get the API key
   */
  static getApiKey(): string {
    return FirecrawlCore.getApiKey();
  }

  /**
   * Test if an API key is valid
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    return FirecrawlCore.testApiKey(apiKey);
  }

  /**
   * Test scraping a simple page directly with the SDK
   */
  static async callTestScrape(url: string): Promise<ScrapeResponse> {
    return FirecrawlScraper.testScrape(url);
  }

  /**
   * Call the Supabase Edge Function to perform crawling
   */
  static async callCrawlingFunction(config: ProviderScrapeConfig): Promise<ScrapeResponse> {
    return FirecrawlCrawler.crawlURL(config);
  }

  /**
   * Call the Supabase Edge Function to perform scraping
   */
  static async callScrapingFunction(config: ProviderScrapeConfig): Promise<ScrapeResponse> {
    return FirecrawlScraper.scrapeURL(config);
  }

  /**
   * Force update of GPU data for all providers
   */
  static async forceUpdateGpuData(): Promise<boolean> {
    return FirecrawlGPU.forceUpdateGpuData();
  }
}

// Re-export other modules for direct access
export * from './core';
export * from './scrape';
export * from './crawl';
export * from './gpu';
