
import { providerConfigs, determineRegion } from "./provider-configs.ts";

export interface ScrapeResponse {
  success: boolean;
  data?: any;
  error?: string;
  warning?: string;
}

export class FirecrawlService {
  private apiKey = Deno.env.get('FIRECRAWL_API_KEY') || "";
  
  getProviderList(): string[] {
    return Object.keys(providerConfigs);
  }
  
  async scrapeProvider(providerName: string): Promise<ScrapeResponse> {
    const config = providerConfigs[providerName.toLowerCase()];
    
    if (!config) {
      return { 
        success: false, 
        error: `No configuration found for provider: ${providerName}` 
      };
    }
    
    try {
      console.log(`Crawling ${providerName} at ${config.url}`);
      
      // For the edge function, we'll use fallback data since we can't directly use the Firecrawl SDK
      console.log(`Using fallback data for ${providerName}`);
      const fallbackData = this.getFallbackData(providerName);
      
      return {
        success: true,
        data: fallbackData,
        warning: `Using fallback data for demonstration`
      };
    } catch (error) {
      console.error(`Error crawling ${providerName}:`, error);
      
      // Use fallback data for this provider
      console.log(`Using fallback data for ${providerName} due to error`);
      const fallbackData = this.getFallbackData(providerName);
      return {
        success: true,
        data: fallbackData,
        warning: `Used fallback data due to error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private getFallbackData(providerName: string): any[] {
    const formattedProviderName = providerName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
      
    const timestamp = new Date().toISOString();
    
    let gpuModels = [];
    
    switch(providerName.toLowerCase()) {
      case 'digitalocean':
        gpuModels = [
          { model: 'A100', vram: 80, price: 2.99 },
          { model: 'A10G', vram: 24, price: 1.49 },
          { model: 'T4', vram: 16, price: 0.89 },
          { model: 'RTX 6000', vram: 48, price: 2.19 },
          { model: 'L40', vram: 48, price: 2.49 },
          { model: 'H100', vram: 80, price: 3.99 },
          { model: 'RTX 4090', vram: 24, price: 1.79 },
          { model: 'A40', vram: 48, price: 1.99 }
        ];
        break;
      case 'runpod':
        gpuModels = [
          { model: 'RTX 4090', vram: 24, price: 1.69 },
          { model: 'RTX 3090', vram: 24, price: 0.99 },
          { model: 'A100', vram: 80, price: 2.29 },
          { model: 'H100', vram: 80, price: 3.49 },
          { model: 'RTX A6000', vram: 48, price: 1.59 },
          { model: 'RTX 3080', vram: 10, price: 0.85 },
          { model: 'L40', vram: 48, price: 1.79 },
          { model: 'A40', vram: 48, price: 1.29 }
        ];
        break;
      case 'vast':
        gpuModels = [
          { model: 'RTX 4090', vram: 24, price: 0.49 },
          { model: 'RTX 3080', vram: 10, price: 0.29 },
          { model: 'A100', vram: 40, price: 0.89 },
          { model: 'RTX 3090', vram: 24, price: 0.39 },
          { model: 'RTX A5000', vram: 24, price: 0.69 },
          { model: 'RTX A4000', vram: 16, price: 0.59 },
          { model: 'H100', vram: 80, price: 1.89 },
          { model: 'L40', vram: 48, price: 0.79 }
        ];
        break;
      case 'valdi':
        gpuModels = [
          { model: 'RTX 4080', vram: 16, price: 0.99 },
          { model: 'A100', vram: 80, price: 2.49 },
          { model: 'H100', vram: 80, price: 3.99 },
          { model: 'A6000', vram: 48, price: 1.89 },
          { model: 'RTX 4090', vram: 24, price: 1.29 },
          { model: 'RTX 3090', vram: 24, price: 0.89 },
          { model: 'RTX 5090', vram: 32, price: 1.99 },
          { model: 'L40S', vram: 48, price: 1.69 }
        ];
        break;
      case 'coreweave':
        gpuModels = [
          { model: 'H100', vram: 80, price: 3.29 },
          { model: 'A100', vram: 80, price: 1.59 },
          { model: 'RTX 4090', vram: 24, price: 0.79 },
          { model: 'RTX A6000', vram: 48, price: 1.49 },
          { model: 'RTX A5000', vram: 24, price: 0.99 },
          { model: 'RTX 3080', vram: 10, price: 0.69 },
          { model: 'L40', vram: 48, price: 1.49 },
          { model: 'A40', vram: 48, price: 1.19 }
        ];
        break;
      case 'nebius':
        gpuModels = [
          { model: 'RTX 3090', vram: 24, price: 0.79 },
          { model: 'A6000', vram: 48, price: 1.89 },
          { model: 'RTX 4080', vram: 16, price: 0.99 },
          { model: 'L40', vram: 48, price: 2.19 },
          { model: 'A100', vram: 40, price: 1.79 },
          { model: 'T4', vram: 16, price: 0.59 },
          { model: 'RTX 4090', vram: 24, price: 1.29 },
          { model: 'H100', vram: 80, price: 3.19 }
        ];
        break;
      case 'tencentcloud':
        gpuModels = [
          { model: 'A100', vram: 80, price: 2.79 },
          { model: 'T4', vram: 16, price: 0.69 },
          { model: 'V100', vram: 32, price: 1.59 },
          { model: 'P4', vram: 8, price: 0.49 },
          { model: 'RTX 3090', vram: 24, price: 1.29 },
          { model: 'RTX 4090', vram: 24, price: 1.69 },
          { model: 'GN7', vram: 24, price: 0.99 },
          { model: 'GN6', vram: 16, price: 0.79 }
        ];
        break;
      default:
        gpuModels = [
          { model: 'RTX 4090', vram: 24, price: 1.99 },
          { model: 'RTX 3080', vram: 10, price: 0.99 },
          { model: 'A100', vram: 80, price: 2.99 },
          { model: 'H100', vram: 80, price: 3.99 },
          { model: 'RTX A6000', vram: 48, price: 2.29 },
          { model: 'RTX 3090 Ti', vram: 24, price: 1.59 },
          { model: 'L40', vram: 48, price: 1.99 },
          { model: 'A40', vram: 48, price: 1.79 }
        ];
    }
    
    console.log(`Generated fallback data for ${providerName} with ${gpuModels.length} models`);
    
    return gpuModels.map(gpu => {
      const pricePerGBVram = gpu.price / gpu.vram;
      return {
        provider: formattedProviderName,
        gpuModel: gpu.model,
        vramGB: gpu.vram,
        pricePerHour: gpu.price,
        pricePerGBVram: pricePerGBVram,
        region: determineRegion(providerName),
        scrapeTimestamp: timestamp
      };
    });
  }
}

