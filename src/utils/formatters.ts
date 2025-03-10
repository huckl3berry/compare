
/**
 * Format a number as a price with 4 decimal places
 */
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(value);
};

/**
 * Format a number as a price with 2 decimal places
 */
export const formatPriceShort = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date as a relative time (e.g. "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
};

/**
 * Format a number with commas (e.g. 1,000)
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Convert a VRAM value to a readable string 
 */
export const formatVRam = (vramGB: number): string => {
  return vramGB >= 1000 ? `${vramGB / 1000}TB` : `${vramGB}GB`;
};

/**
 * Get provider color for charts
 */
export const getProviderColor = (providerName: string): string => {
  const colorMap: Record<string, string> = {
    'RunPod': '#3b82f6',
    'VastAI': '#8b5cf6',
    'CoreWeave': '#ec4899',
    'Lambda': '#10b981',
    'DigitalOcean': '#0ea5e9',
    'MartCantobo': '#f59e0b',
    'ValdiPrime': '#ef4444',
    'Intellect': '#6366f1',
    'Nebious': '#14b8a6',
    'Tencent': '#06b6d4'
  };
  
  return colorMap[providerName] || '#9ca3af';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
