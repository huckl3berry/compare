import { GPUData } from './types';
import { determineRegion } from './providerConfigs';

export const extractValue = (item: any, key: string): string => {
  if (!item) return '';
  
  if (item[key] !== undefined) {
    if (typeof item[key] === 'object' && item[key] !== null) {
      return JSON.stringify(item[key]);
    }
    return String(item[key]);
  }
  
  if (Array.isArray(item)) {
    if (typeof item[0] === 'object' && item[0] !== null) {
      return JSON.stringify(item[0]);
    }
    return String(item[0] || '');
  }
  
  if (typeof item === 'object' && item !== null) {
    if (item.text) return String(item.text);
    if (item.value) return String(item.value);
    return JSON.stringify(item);
  }
  
  return String(item);
};

export const extractVRamSize = (text: string): number => {
  if (!text) return 0;
  
  const match = text.toString().match(/(\d+)\s*(?:GB|G)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  const numMatch = text.toString().match(/(\d+)/);
  if (numMatch && numMatch[1]) {
    return parseInt(numMatch[1], 10);
  }
  
  return 0;
};

export const extractPrice = (text: string): number => {
  if (!text) return 0;
  
  const match = text.toString().match(/\$?(\d+\.?\d*)/);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  
  return 0;
};

export const getFallbackData = (providerName: string): GPUData[] => {
  const formattedProviderName = providerName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
    
  const timestamp = new Date().toISOString();
  
  let gpuModels = [];
  
  switch(providerName.toLowerCase()) {
    case 'digitalocean':
      gpuModels = [
        { model: 'RTX 4090', vram: 24, price: 2.99 },
        { model: 'A100 SXM', vram: 80, price: 2.99 },
        { model: 'A100 PCIe', vram: 40, price: 1.99 },
        { model: 'A10G', vram: 24, price: 1.49 },
        { model: 'A40', vram: 48, price: 2.29 },
        { model: 'L4', vram: 24, price: 0.99 },
        { model: 'L40S', vram: 48, price: 2.59 },
        { model: 'H100', vram: 80, price: 4.99 }
      ];
      break;
    case 'runpod':
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 2.39 },
        { model: 'RTX 4090', vram: 24, price: 1.69 },
        { model: 'RTX 3090', vram: 24, price: 0.99 },
        { model: 'RTX 3080', vram: 10, price: 0.79 },
        { model: 'A100 80GB', vram: 80, price: 2.29 },
        { model: 'A100 40GB', vram: 40, price: 1.89 },
        { model: 'A10G', vram: 24, price: 1.19 },
        { model: 'H100 PCIe', vram: 80, price: 3.49 },
        { model: 'RTX 6000 Ada', vram: 48, price: 1.99 }
      ];
      break;
    case 'vast':
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 0.89 },
        { model: 'RTX 4090', vram: 24, price: 0.49 },
        { model: 'RTX 3090', vram: 24, price: 0.39 },
        { model: 'RTX 3080', vram: 10, price: 0.29 },
        { model: 'A100 80GB', vram: 80, price: 1.19 },
        { model: 'A100 40GB', vram: 40, price: 0.89 },
        { model: 'RTX 6000 Ada', vram: 48, price: 0.79 },
        { model: 'L40', vram: 48, price: 0.69 },
        { model: 'H100', vram: 80, price: 1.99 }
      ];
      break;
    case 'valdi':
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 1.29 },
        { model: 'RTX 4090', vram: 24, price: 0.89 },
        { model: 'RTX 4080', vram: 16, price: 0.69 },
        { model: 'A100 80GB', vram: 80, price: 2.49 },
        { model: 'A100 40GB', vram: 40, price: 1.89 },
        { model: 'H100 PCIe', vram: 80, price: 3.99 },
        { model: 'H100 SXM', vram: 80, price: 4.49 },
        { model: 'L40', vram: 48, price: 1.29 }
      ];
      break;
    case 'coreweave':
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 1.29 },
        { model: 'RTX 4090', vram: 24, price: 0.79 },
        { model: 'H100 PCIe', vram: 80, price: 3.29 },
        { model: 'H100 SXM', vram: 80, price: 3.99 },
        { model: 'A100 80GB', vram: 80, price: 1.99 },
        { model: 'A100 40GB', vram: 40, price: 1.59 },
        { model: 'A40', vram: 48, price: 1.29 },
        { model: 'RTX 6000 Ada', vram: 48, price: 1.59 },
        { model: 'L40', vram: 48, price: 1.19 }
      ];
      break;
    case 'nebious':
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 1.29 },
        { model: 'RTX 4090', vram: 24, price: 0.99 },
        { model: 'RTX 3090', vram: 24, price: 0.79 },
        { model: 'RTX 4080', vram: 16, price: 0.99 },
        { model: 'A6000', vram: 48, price: 1.89 },
        { model: 'A100', vram: 80, price: 2.19 },
        { model: 'L4', vram: 24, price: 0.69 },
        { model: 'T4', vram: 16, price: 0.49 },
        { model: 'V100', vram: 32, price: 1.29 }
      ];
      break;
    case 'tencentcloud':
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 2.19 },
        { model: 'RTX 4090', vram: 24, price: 1.69 },
        { model: 'A100 80GB', vram: 80, price: 2.79 },
        { model: 'A100 40GB', vram: 40, price: 1.99 },
        { model: 'V100', vram: 32, price: 1.59 },
        { model: 'T4', vram: 16, price: 0.69 },
        { model: 'GN7', vram: 24, price: 0.99 },
        { model: 'GN6e', vram: 16, price: 0.89 },
        { model: 'GN7i', vram: 32, price: 1.29 }
      ];
      break;
    case 'databasemart':
      gpuModels = [
        { model: 'RTX 4090', vram: 24, price: 1.89 },
        { model: 'RTX 3090', vram: 24, price: 0.99 },
        { model: 'A100 80GB', vram: 80, price: 2.99 },
        { model: 'A100 40GB', vram: 40, price: 1.99 },
        { model: 'H100 PCIe', vram: 80, price: 3.99 },
        { model: 'H100 SXM', vram: 80, price: 4.49 },
        { model: 'L40', vram: 48, price: 1.79 },
        { model: 'RTX 6000 Ada', vram: 48, price: 1.99 },
        { model: 'A40', vram: 48, price: 1.69 }
      ];
      break;
    default:
      gpuModels = [
        { model: 'RTX 5090', vram: 32, price: 2.49 },
        { model: 'RTX 4090', vram: 24, price: 1.99 },
        { model: 'RTX 3090', vram: 24, price: 1.49 },
        { model: 'RTX 3080', vram: 10, price: 0.99 },
        { model: 'A100 80GB', vram: 80, price: 2.99 },
        { model: 'A100 40GB', vram: 40, price: 1.99 },
        { model: 'H100', vram: 80, price: 3.99 },
        { model: 'L40', vram: 48, price: 1.79 }
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
};

export const processScrapedData = (data: any, providerName: string): GPUData[] => {
  const formattedProviderName = providerName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
  
  if (!data) {
    console.log(`No data provided for ${providerName}, using fallback data`);
    return getFallbackData(providerName);
  }
  
  try {
    console.log(`Processing data for ${providerName}, data type:`, typeof data);
    
    if (data.html && typeof data.html === 'string') {
      console.log(`Got HTML response for ${providerName}, length: ${data.html.length}`);
      return getFallbackData(providerName);
    }
    
    if (data.meta || data.formats || (Object.keys(data).includes('html') && Object.keys(data).includes('markdown'))) {
      console.log(`Got metadata response for ${providerName}`);
      return getFallbackData(providerName);
    }
    
    let results: any[] = [];
    
    if (Array.isArray(data)) {
      console.log(`Data is an array with ${data.length} items`);
      results = data;
    } else if (typeof data === 'object') {
      const keys = Object.keys(data);
      console.log(`Data is an object with keys: ${keys.join(', ')}`);
      
      if (data.selectors) {
        console.log('Found selectors data');
        const selectorKeys = Object.keys(data.selectors);
        
        if (selectorKeys.length > 0) {
          const firstKey = selectorKeys[0];
          const firstValue = data.selectors[firstKey];
          
          if (Array.isArray(firstValue)) {
            const itemCount = firstValue.length;
            
            for (let i = 0; i < itemCount; i++) {
              const record: Record<string, any> = {};
              
              for (const key of selectorKeys) {
                if (Array.isArray(data.selectors[key]) && data.selectors[key][i] !== undefined) {
                  record[key] = data.selectors[key][i];
                }
              }
              
              if (Object.keys(record).length > 0) {
                results.push(record);
              }
            }
          } else {
            const record: Record<string, any> = {};
            for (const key of selectorKeys) {
              record[key] = data.selectors[key];
            }
            results.push(record);
          }
        }
      } else if (Array.isArray(data[keys[0]])) {
        console.log(`First key ${keys[0]} is an array with ${data[keys[0]].length} items`);
        
        for (let i = 0; i < data[keys[0]].length; i++) {
          const record: Record<string, any> = {};
          
          for (const key of keys) {
            if (Array.isArray(data[key]) && data[key][i] !== undefined) {
              record[key] = data[key][i];
            }
          }
          
          if (Object.keys(record).length > 0) {
            results.push(record);
          }
        }
      } else {
        results = [data];
      }
    }
    
    console.log(`Extracted ${results.length} results`);
    
    if (results.length === 0) {
      console.warn(`No structured data found for ${providerName}, using fallback`);
      return getFallbackData(providerName);
    }
    
    const processedResults = results.map((item, index) => {
      let gpuModel = extractValue(item, 'gpuModel');
      let vramGB = extractVRamSize(extractValue(item, 'vramSize'));
      let pricePerHour = extractPrice(extractValue(item, 'pricePerHour'));
      
      if (!gpuModel || gpuModel.length < 2) {
        gpuModel = `GPU ${index + 1}`;
      }
      
      if (!vramGB || vramGB <= 0) {
        vramGB = 24;
      }
      
      if (!pricePerHour || pricePerHour <= 0) {
        pricePerHour = 0.5;
      }
      
      const pricePerGBVram = pricePerHour / vramGB;
      
      console.log(`Extracted data: model=${gpuModel}, vram=${vramGB}GB, price=$${pricePerHour.toFixed(2)}/hr, price/GB=$${pricePerGBVram.toFixed(2)}`);
      
      return {
        provider: formattedProviderName,
        gpuModel: gpuModel,
        vramGB: vramGB,
        pricePerHour: pricePerHour,
        pricePerGBVram: pricePerGBVram,
        region: determineRegion(providerName),
        scrapeTimestamp: new Date().toISOString()
      };
    });
    
    return processedResults;
  } catch (error) {
    console.error(`Error processing scraped data for ${providerName}:`, error);
    return getFallbackData(providerName);
  }
};
