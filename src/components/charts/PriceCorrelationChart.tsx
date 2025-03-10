
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, getProviderColor } from '@/utils/formatters';

interface BubbleDataPoint {
  name: string;
  vram: number;
  pricePerHour: number;
  pricePerGB: number;
  provider: string;
  model: string;
  z: number;
}

interface PriceCorrelationChartProps {
  bubbleData: BubbleDataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/80 p-3 rounded-lg shadow-lg border border-gray-700 text-white">
        <p className="font-medium">{data.provider} - {data.model}</p>
        <p>VRAM: {data.vram} GB</p>
        <p>Price/Hour: {formatPrice(data.pricePerHour)}</p>
        <p>Price/GB: {formatPrice(data.pricePerGB)}</p>
      </div>
    );
  }
  return null;
};

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({ bubbleData }) => {
  return (
    <Card className="bg-gradient-to-br from-card to-muted/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="heading-gradient">Price Correlation Analysis</CardTitle>
        <CardDescription>
          Relationship between VRAM size and pricing efficiency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis
                type="number"
                dataKey="vram"
                name="VRAM"
                unit=" GB"
                stroke="#888"
                tick={{ fill: '#aaa' }}
                domain={[0, 'dataMax + 5']}
              />
              <YAxis
                type="number"
                dataKey="pricePerGB"
                name="Price/GB"
                unit="$"
                stroke="#888"
                tick={{ fill: '#aaa' }}
                domain={[0, 'dataMax + 0.01']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter
                name="Price/VRAM Correlation"
                data={bubbleData}
                fill="#8884d8"
              >
                {bubbleData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getProviderColor(entry.provider) || '#8884d8'} 
                    fillOpacity={0.7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-400">Key Findings</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <span className="text-green-400 mt-1">•</span>
                <span>
                  <strong className="text-orange-300">Negative correlation:</strong> As VRAM size increases, price per GB tends to decrease, making higher memory GPUs more cost-effective.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-green-400 mt-1">•</span>
                <span>
                  <strong className="text-orange-300">Provider grouping:</strong> Providers tend to cluster together in pricing strategies, indicating market segments.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-green-400 mt-1">•</span>
                <span>
                  <strong className="text-orange-300">Price outliers:</strong> Some providers offer significantly better value for specific models, creating opportunities for cost savings.
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-300">Recommendations</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <span className="text-orange-300 mt-1">•</span>
                <span>
                  <strong className="text-green-400">Value shoppers:</strong> Consider higher memory GPUs (40GB+) from budget providers for the best price/performance ratio.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-orange-300 mt-1">•</span>
                <span>
                  <strong className="text-green-400">Performance users:</strong> Look for A100 or H100 models from providers with below-average pricing.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-orange-300 mt-1">•</span>
                <span>
                  <strong className="text-green-400">Budget constraints:</strong> RTX series GPUs from value providers offer good performance at more accessible price points.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelationChart;
