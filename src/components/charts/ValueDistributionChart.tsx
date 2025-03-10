
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProviderColor, formatPrice } from '@/utils/formatters';

interface BubbleDataPoint {
  name: string;
  vram: number;
  pricePerHour: number;
  pricePerGB: number;
  provider: string;
  model: string;
  z: number;
}

interface ValueDistributionChartProps {
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

const ValueDistributionChart: React.FC<ValueDistributionChartProps> = ({ bubbleData }) => {
  return (
    <Card className="bg-gradient-to-br from-card to-muted/80 backdrop-blur-sm border-green-500/40">
      <CardHeader>
        <CardTitle className="text-green-500">Value Distribution</CardTitle>
        <CardDescription>
          Price vs VRAM across all available GPU options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                dataKey="pricePerHour"
                name="Price/Hour"
                unit="$"
                stroke="#888"
                tick={{ fill: '#aaa' }}
                domain={[0, 'dataMax + 0.5']}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 200]} 
                scale="linear"
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="GPUs"
                data={bubbleData}
                fill="#8884d8"
              >
                {bubbleData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getProviderColor(entry.provider) || '#22c55e'}
                    fillOpacity={0.7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-medium text-green-500">Value Insights</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Higher VRAM GPUs tend to be more cost-effective per GB
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                The sweet spot for value appears to be around <span className="text-green-500 font-medium">40-80 GB</span> VRAM models
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                There is a <span className="text-green-500 font-medium">300%</span> price variation for similar GPUs across providers
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueDistributionChart;
