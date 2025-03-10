
export interface ScrapeResponse {
  success: boolean;
  data?: any;
  error?: string;
  warning?: string;
}

export interface ProviderScrapeConfig {
  url: string;
  selectors: Record<string, string>;
  waitForSelector?: string;
}

export interface GPUData {
  provider: string;
  gpuModel: string;
  vramGB: number;
  pricePerHour: number;
  pricePerGBVram: number;
  region: string;
  scrapeTimestamp: string;
}

// Adding the missing interface definitions
export interface ErrorResponse {
  success: false;
  error: string;
}

export interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

export interface CrawlResult {
  url: string;
  html?: string;
  markdown?: string;
  text?: string;
}

export interface CrawlResultsResponse {
  results: CrawlResult[];
  message?: string;
  error?: string;
}

export interface ScrapeOptions {
  waitFor?: number;
  waitForSelector?: string;
  formats?: string[];
}

export interface CrawlOptions {
  limit?: number;
  waitFor?: number;
  formats?: string[];
}

// Combined response type
export type CrawlResponse = CrawlStatusResponse | ErrorResponse;
