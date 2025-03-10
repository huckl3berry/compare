
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  loading?: boolean;
}

export interface GPUData {
  provider: string;
  gpuModel: string;
  vramGB: number;
  pricePerHour: number;
  pricePerGBVram: number;
  region: string;
  providerUrl?: string;
}
