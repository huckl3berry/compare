
export const providerConfigs = {
  digitalOcean: {
    url: 'https://www.digitalocean.com/products/gpu-droplets',
    selectors: {
      gpuModel: '.gpu-card .title, .gpu-pricing-card .card-title, table td:first-child, .specs-name:contains("GPU"), .pricing-table tr td:nth-child(1), .technical-specs li:contains("GPU")',
      vramSize: '.specs-list .specs-value:contains("VRAM"), .specs-list .specs-value:contains("GB"), .specs-desc:contains("GB"), .pricing-table tr td:nth-child(2), .technical-specs li:contains("Memory")',
      pricePerHour: '.price-box .price, .gpu-pricing-card .price-value, .price, .pricing-table tr td:nth-child(4), table td:contains("$")'
    },
    waitForSelector: '.gpu-card, .gpu-pricing-card, .specs-list, table, .pricing-table'
  },
  runpod: {
    url: 'https://www.runpod.io/pricing',
    selectors: {
      gpuModel: 'tr td:first-child, .gpu-name, .gpu-model, .pricing-table tr td:nth-child(1), table.pricing-data td:nth-child(1)',
      vramSize: 'tr td:nth-child(2), .gpu-memory, .memory-size, .pricing-table tr td:nth-child(2), table.pricing-data td:nth-child(2)',
      pricePerHour: 'tr td:nth-child(4), .price-per-hour, .price, .pricing-table tr td:nth-child(3), table.pricing-data td:nth-child(4)'
    },
    waitForSelector: 'table, tr, .gpu-name, .gpu-model, .pricing-table, table.pricing-data'
  },
  vast: {
    url: 'https://vast.ai/pricing',
    selectors: {
      gpuModel: '.pricing-table tr td:first-child, .pricing__body td:nth-child(1), td strong, .gpu-model, .model-name, table td:first-child, .pricing-card-title',
      vramSize: '.pricing-table tr td:nth-child(2), .pricing__body td:nth-child(2), td:contains("GB"), .memory-size, table td:nth-child(2), .pricing-card-memory',
      pricePerHour: '.pricing-table tr td:nth-child(3), .pricing__body td:nth-child(4), td:contains("$"), .price, table td:nth-child(4), .pricing-card-price'
    },
    waitForSelector: 'table, .pricing-table, .pricing__body, tr, .pricing-card'
  },
  valdi: {
    url: 'https://www.valdi.ai/compute',
    selectors: {
      gpuModel: '.pricing-cards .card-title, .gpu-model-name, tr td:first-child, td:contains("GPU"), .pricing-table td:nth-child(1), .gpu-info div:first-child',
      vramSize: '.pricing-cards .memory-size, .vram-info, tr td:contains("GB"), td:contains("Memory"), .pricing-table td:nth-child(2), .memory-info',
      pricePerHour: '.pricing-cards .price-tag, .hourly-rate, tr td:contains("$"), td:contains("/hr"), .pricing-table td:nth-child(4), .price-info'
    },
    waitForSelector: '.pricing-cards, .gpu-model-name, table, tr, .pricing-table, .gpu-info'
  },
  coreweave: {
    url: 'https://www.coreweave.com/pricing',
    selectors: {
      gpuModel: 'tbody tr td:first-child, .gpu-model, .card-title:contains("GPU"), table td:contains("NVIDIA"), table td:contains("RTX"), .pricing-card-header, .pricing-table tr td:nth-child(1)',
      vramSize: 'tbody tr td:nth-child(2), .memory, table td:contains("GB"), .specs-item:contains("Memory"), .memory-spec, .pricing-table tr td:nth-child(2)',
      pricePerHour: 'tbody tr td:nth-child(4), .price, table td:contains("$"), .pricing-value, .price-info, .pricing-table tr td:nth-child(4)'
    },
    waitForSelector: 'tbody, tr, td, .gpu-model, table, .pricing-card, .pricing-table'
  },
  nebius: {
    url: 'https://nebius.com/prices',
    selectors: {
      gpuModel: '.price-table tr td:first-child, .gpu-specs td:contains("Model"), .model-name, table td:first-child, .gpu-table td:nth-child(1)',
      vramSize: '.price-table tr td:nth-child(2), .gpu-specs td:contains("Memory"), .vram-spec, table td:nth-child(2), .gpu-table td:nth-child(2)',
      pricePerHour: '.price-table tr td:nth-child(4), .price-info, .hourly-rate, td:contains("$"), table td:nth-child(4), .gpu-table td:nth-child(4)'
    },
    waitForSelector: '.price-table, .gpu-specs, table, tr, .gpu-table'
  },
  tencentcloud: {
    url: 'https://www.tencentcloud.com/products/gpu',
    selectors: {
      gpuModel: '.pricing-table tr td:first-child, .gpu-instance-type, td:contains("GPU"), td:contains("NVIDIA"), table td:first-child, .product-table td:nth-child(1)',
      vramSize: '.pricing-table tr td:nth-child(3), .instance-specs, td:contains("GB"), td:contains("Memory"), table td:nth-child(2), .product-table td:nth-child(2)',
      pricePerHour: '.pricing-table tr td:nth-child(4), .price-column, td:contains("$"), td:contains("/Hour"), table td:nth-child(4), .product-table td:nth-child(4)'
    },
    waitForSelector: '.pricing-table, .gpu-instance-type, table, tr, .product-table'
  },
  databasemart: {
    url: 'https://www.databasemart.com/gpu-server',
    selectors: {
      gpuModel: '.pricing-table tr td:first-child, .gpu-model-name, .model-name, table td:contains("GPU"), .gpu-specs h3, .model-info, .gpu-type',
      vramSize: '.pricing-table tr td:contains("GB"), .memory-size, .vram-info, td:contains("Memory"), .gpu-specs p:contains("GB"), .memory-info',
      pricePerHour: '.pricing-table tr td:contains("$"), .price-tag, .hourly-rate, td:contains("/hr"), .price-info, .cost'
    },
    waitForSelector: '.pricing-table, table, .gpu-specs, .pricing-section'
  }
};

export const determineRegion = (providerName: string): string => {
  switch(providerName.toLowerCase()) {
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
    case 'databasemart':
      return 'US East';
    default:
      const regions = ['US East', 'US West', 'Europe', 'Asia Pacific'];
      return regions[Math.floor(Math.random() * regions.length)];
  }
};
