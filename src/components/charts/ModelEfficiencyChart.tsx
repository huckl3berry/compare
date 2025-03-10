
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Card as CardComponent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface ModelEfficiencyData {
  model: string;
  avgPricePerGB: number;
  vram: number;
  count: number;
}

interface ModelEfficiencyChartProps {
  modelEfficiencyData: ModelEfficiencyData[];
}

const ModelEfficiencyChart: React.FC<ModelEfficiencyChartProps> = ({ modelEfficiencyData }) => {
  return (
    <Card className="bg-gradient-to-br from-card to-muted/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="heading-gradient">GPU Model Efficiency</CardTitle>
        <CardDescription>
          Comparison of price per GB VRAM across different GPU models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 50, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis
                type="category"
                dataKey="model"
                name="GPU Model"
                stroke="#888"
                tick={(props) => {
                  const { x, y, payload } = props;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text 
                        x={0} 
                        y={0} 
                        dy={16} 
                        textAnchor="end" 
                        fill="#aaa" 
                        transform="rotate(-45)"
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
                height={100}
              />
              <YAxis
                type="number"
                dataKey="avgPricePerGB"
                name="Avg Price/GB"
                unit="$"
                stroke="#888"
                tick={{ fill: '#aaa' }}
                domain={[0, 'dataMax + 0.01']}
              />
              <ZAxis
                type="number"
                dataKey="vram"
                range={[50, 350]}
                name="VRAM"
                unit=" GB"
              />
              <Tooltip />
              <Legend />
              <Scatter
                name="GPU Models"
                data={modelEfficiencyData}
                fill="#8884d8"
              >
                {modelEfficiencyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.avgPricePerGB < 0.03 ? '#4ADE80' : entry.avgPricePerGB < 0.05 ? '#F97316' : '#ef4444'}
                    fillOpacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-orange-300">Most Efficient GPU Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelEfficiencyData.slice(0, 6).map((model, index) => (
              <CardComponent key={model.model} className={cn(
                "bg-gradient-to-br from-muted/90 to-card/70 backdrop-blur-sm overflow-hidden",
                index === 0 ? "border-green-500/70" : "border-orange-400/30"
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className={cn(
                    "text-lg",
                    index === 0 ? "text-green-400" : "text-orange-300"
                  )}>
                    {model.model}
                  </CardTitle>
                  <CardDescription>
                    {model.vram} GB VRAM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Price/GB:</span>
                    <span className="font-semibold text-green-400">
                      ${model.avgPricePerGB.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Available from:</span>
                    <span className="font-medium">
                      {model.count} provider{model.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </CardComponent>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelEfficiencyChart;
