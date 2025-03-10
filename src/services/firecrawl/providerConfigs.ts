
import { ProviderScrapeConfig } from './types';

export const providerConfigs: Record<string, ProviderScrapeConfig> = {
  digitalOcean: {
    url: 'https://www.digitalocean.com/products/gpu-droplets',
    selectors: {
      gpuModel: '.gpu-card .title, .gpu-pricing-card .card-title, table td:first-child, .specs-name:contains("GPU"), .features-list li strong, .pricing-box h3, .pricing-model h4',
      vramSize: '.specs-list .specs-value:contains("VRAM"), .specs-list .specs-value:contains("GB"), .specs-desc:contains("GB"), .memory-info, .specs-row td:nth-child(2), .pricing-details li:contains("GB")',
      pricePerHour: '.price-box .price, .gpu-pricing-card .price-value, .price, .pricing-container .value, .price-cell, h4 + .price'
    },
    waitForSelector: '.gpu-card, .gpu-pricing-card, .specs-list, table, .pricing-section'
  },
  runpod: {
    url: 'https://www.runpod.io/pricing',
    selectors: {
      gpuModel: 'tr td:first-child, .gpu-name, .gpu-model, .pricing-table td:first-child, .model-name, .hardware-specs h4, .gpu-section h3, .gpu-specs-row .model',
      vramSize: 'tr td:nth-child(2), .gpu-memory, .memory-size, .specs-table td:contains("GB"), .memory-specs span, .hardware-specs p:contains("GB"), .memory-detail',
      pricePerHour: 'tr td:nth-child(4), .price-per-hour, .price, .pricing-value, .hourly-cost, .rate-box .value, .price-tag > span'
    },
    waitForSelector: 'table, tr, .gpu-name, .gpu-model, .pricing-section, .pricing-table'
  },
  vast: {
    url: 'https://vast.ai/pricing',
    selectors: {
      gpuModel: '.pricing-table tr td:first-child, .pricing__body td:nth-child(1), td strong, .gpu-model, .model-name, .gpu-spec-row .model, .card-header h3, .hardware-name',
      vramSize: '.pricing-table tr td:nth-child(2), .pricing__body td:nth-child(2), td:contains("GB"), .memory-size, .vram-value, .specs-row:contains("Memory"), .memory-spec span, .hardware-detail li:contains("GB")',
      pricePerHour: '.pricing-table tr td:nth-child(3), .pricing__body td:nth-child(4), td:contains("$"), .price, .hourly-rate, .price-tag, .rate-value, .pricing-box .value'
    },
    waitForSelector: 'table, .pricing-table, .pricing__body, tr, .pricing-section, .gpu-offers'
  },
  valdi: {
    url: 'https://www.valdi.ai/compute',
    selectors: {
      gpuModel: '.pricing-cards .card-title, .gpu-model-name, tr td:first-child, td:contains("GPU"), .hardware-name, .plan-title, .gpu-box h3, .compute-options h4, .model-spec',
      vramSize: '.pricing-cards .memory-size, .vram-info, tr td:contains("GB"), td:contains("Memory"), .specs-list li:contains("GB"), .memory-spec, .hardware-detail:contains("VRAM"), .gpu-spec:contains("GB")',
      pricePerHour: '.pricing-cards .price-tag, .hourly-rate, tr td:contains("$"), td:contains("/hr"), .price-value, .cost-box .value, .price-section .rate, .pricing-value'
    },
    waitForSelector: '.pricing-cards, .gpu-model-name, table, tr, .pricing-section, .compute-options'
  },
  coreweave: {
    url: 'https://www.coreweave.com/pricing',
    selectors: {
      gpuModel: 'tbody tr td:first-child, .gpu-model, .card-title:contains("GPU"), table td:contains("NVIDIA"), table td:contains("RTX"), .pricing-table tbody td:first-child, .model-name, .hardware-spec h4, .gpu-type',
      vramSize: 'tbody tr td:nth-child(2), .memory, table td:contains("GB"), .specs-item:contains("Memory"), .vram-spec, .memory-detail, .hardware-spec li:contains("GB"), .spec-row:contains("VRAM")',
      pricePerHour: 'tbody tr td:nth-child(4), .price, table td:contains("$"), .pricing-value, .price-column, .hourly-cost, .rate-value, .price-box h5'
    },
    waitForSelector: 'tbody, tr, td, .gpu-model, table, .pricing-table, .price-section'
  },
  nebius: {
    url: 'https://nebius.com/prices',
    selectors: {
      gpuModel: '.price-table tr td:first-child, .gpu-specs td:contains("Model"), .model-name, .gpu-table tbody td:first-child, .hardware-name, .gpu-row .type, .compute-model h4, .gpu-instance-name',
      vramSize: '.price-table tr td:nth-child(2), .gpu-specs td:contains("Memory"), .vram-spec, .memory-detail, .gpu-table td:contains("GB"), .hardware-spec:contains("GB"), .memory-size, .specs-item:contains("Memory")',
      pricePerHour: '.price-table tr td:nth-child(4), .price-info, .hourly-rate, td:contains("$"), .price-column, .rate-value, .price-box .value, .pricing-tier .cost'
    },
    waitForSelector: '.price-table, .gpu-specs, table, tr, .pricing-section, .gpu-table'
  },
  tencentCloud: {
    url: 'https://www.tencentcloud.com/products/gpu',
    selectors: {
      gpuModel: '.pricing-table tr td:first-child, .gpu-instance-type, td:contains("GPU"), td:contains("NVIDIA"), .instance-name, .model-type, .hardware-name, .gpu-spec-row .model, .product-title',
      vramSize: '.pricing-table tr td:nth-child(3), .instance-specs, td:contains("GB"), td:contains("Memory"), .memory-spec, .vram-detail, .specs-item:contains("VRAM"), .hardware-spec li:contains("GB")',
      pricePerHour: '.pricing-table tr td:last-child, .price-column, td:contains("$"), td:contains("/Hour"), .price-value, .rate-tag, .cost-display, .pricing-value strong'
    },
    waitForSelector: '.pricing-table, .gpu-instance-type, table, tr, .pricing-section, .product-list'
  },
  databaseMart: {
    url: 'https://www.databasemart.com/gpu-server',
    selectors: {
      gpuModel: '.pricing-table tr td:first-child, .gpu-model-name, .model-name, table td:contains("GPU"), .gpu-specs h3, .model-info, .hardware-name, .gpu-type',
      vramSize: '.pricing-table tr td:contains("GB"), .memory-size, .vram-info, td:contains("Memory"), .gpu-specs p:contains("GB"), .memory-info, .specs-item:contains("Memory")',
      pricePerHour: '.pricing-table tr td:contains("$"), .price-tag, .hourly-rate, td:contains("/hr"), .price-info, .cost, .pricing-value'
    },
    waitForSelector: '.pricing-table, table, .gpu-specs, .pricing-section'
  }
};

export const determineRegion = (providerName: string): string => {
  switch(providerName.toLowerCase()) {
    case 'databasemart':
      return 'US East';
    case 'digitalocean':
      return 'US East';
    case 'runpod':
      return 'US West';
    case 'vast':
      return 'Europe';
    case 'valdi':
      return 'US North';
    case 'coreweave':
      return 'US Central';
    case 'nebius':
      return 'US East';
    case 'tencentcloud':
      return 'Asia Pacific';
    default:
      const regions = ['US East', 'US West', 'Europe', 'Asia Pacific'];
      return regions[Math.floor(Math.random() * regions.length)];
  }
};
