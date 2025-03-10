
import FirecrawlApp from '@mendable/firecrawl-js';

/**
 * Core API functionality for interacting with the Firecrawl service
 */
export class FirecrawlCore {
  private static API_KEY = 'fc-00658eef64c34089959db3db94a198f2';
  private static firecrawlApp: FirecrawlApp | null = null;
  
  /**
   * Get the API key
   */
  static getApiKey(): string {
    return this.API_KEY;
  }

  /**
   * Get or initialize the FirecrawlApp instance
   */
  static getFirecrawlApp(): FirecrawlApp {
    if (!this.firecrawlApp) {
      this.firecrawlApp = new FirecrawlApp({ apiKey: this.API_KEY });
    }
    return this.firecrawlApp;
  }

  /**
   * Test if an API key is valid
   */
  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const tempApp = new FirecrawlApp({ apiKey });
      const response = await tempApp.scrapeUrl('https://example.com', {
        formats: ['markdown', 'html']
      });
      return response.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }
}

/**
 * Make a direct request to the Firecrawl API
 */
export const makeFirecrawlAPIRequest = async <T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> => {
  try {
    const response = await fetch(`https://api.firecrawl.io${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FirecrawlCore.getApiKey()}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch data from Firecrawl API');
    }

    return await response.json();
  } catch (error) {
    console.error(`Firecrawl API error (${endpoint}):`, error);
    throw error;
  }
};
