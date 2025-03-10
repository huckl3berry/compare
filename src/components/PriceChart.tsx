
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPriceShort, getProviderColor } from '@/utils/formatters';
import { ChartBarIcon, ExternalLink } from 'lucide-react';
import { processChartData, getProviderUrl, type PriceData } from './charts/PriceChartUtils';
import PriceTooltip from './charts/PriceTooltip';

interface PriceChartProps {
  data: PriceData[];
  className?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, className }) => {
  const [chartType, setChartType] = useState<'price' | 'price-per-gb'>('price-per-gb');
  const [activeTooltip, setActiveTooltip] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const handleClearTooltip = () => {
      setActiveTooltip(false);
      setActiveIndex(null);
    };
    
    document.addEventListener('clearTooltip', handleClearTooltip);
    return () => {
      document.removeEventListener('clearTooltip', handleClearTooltip);
    };
  }, []);
  
  const chartData = useMemo(() => {
    return processChartData(data, chartType);
  }, [data, chartType]);
  
  const handleClick = (data: any, index: number) => {
    setActiveIndex(index);
    setActiveTooltip(true);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-primary" />
              {chartType === 'price-per-gb' ? 'Price per GB VRAM' : 'Price per Hour'}
            </CardTitle>
            <CardDescription>
              {chartType === 'price-per-gb' 
                ? 'Most cost-efficient GPUs by VRAM pricing'
                : 'Lowest hourly rental prices'}
            </CardDescription>
          </div>
          
          <Select
            value={chartType}
            onValueChange={(value) => setChartType(value as 'price' | 'price-per-gb')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-per-gb">Price per GB VRAM</SelectItem>
              <SelectItem value="price">Price per Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onClick={() => {
                if (activeTooltip) {
                  setActiveTooltip(false);
                  setActiveIndex(null);
                }
              }}
            >
              <XAxis 
                type="number" 
                tickFormatter={(value) => formatPriceShort(value)}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                fontSize={12}
                width={150}
                tickLine={false}
                axisLine={false}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const itemIndex = chartData.findIndex(item => item.name === payload.value);
                  const provider = chartData[itemIndex]?.provider || '';
                  
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <a 
                        href={getProviderUrl(provider)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        <text 
                          x={0} 
                          y={0} 
                          textAnchor="end" 
                          fill="#aaa"
                          className="hover:fill-primary cursor-pointer"
                        >
                          {payload.value}
                        </text>
                      </a>
                    </g>
                  );
                }}
              />
              {activeTooltip && activeIndex !== null && (
                <Tooltip 
                  content={
                    <PriceTooltip 
                      active={true} 
                      payload={[{ payload: chartData[activeIndex] }]} 
                      label="" 
                      chartType={chartType}
                      getProviderUrl={getProviderUrl}
                    />
                  }
                  active={true}
                  payload={[{ payload: chartData[activeIndex] }]}
                  wrapperStyle={{ zIndex: 1001 }}
                />
              )}
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                animationDuration={500}
                onClick={handleClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getProviderColor(entry.provider)}
                    opacity={activeIndex === index ? 1 : 0.85}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-green-400">Price Insights</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <span className="text-green-400 font-medium">{chartData[0]?.name}</span> from <span className="text-green-400 font-medium">{chartData[0]?.provider}</span> offers the best value
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Up to <span className="text-orange-300 font-medium">300%</span> price difference between providers for similar GPUs
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-orange-300">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-1 text-sm">
              {Array.from(new Set(chartData.slice(0, 6).map(item => item.provider))).map(provider => (
                <li key={provider} className="flex items-center gap-1">
                  <a 
                    href={getProviderUrl(provider)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {provider}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
