
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ComparisonTooltip from './ComparisonTooltip';
import { getProviderUrl } from './PriceChartUtils';
import { ExternalLink } from 'lucide-react';

interface ProviderStats {
  provider: string;
  gpuCount: number;
  avgPricePerGB: number;
  minPricePerGB: number;
  maxPricePerGB: number;
  avgVram: number;
  color: string;
}

interface ProviderComparisonChartProps {
  providerStats: ProviderStats[];
}

const ProviderComparisonChart: React.FC<ProviderComparisonChartProps> = ({ providerStats }) => {
  const [activeTooltip, setActiveTooltip] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  
  React.useEffect(() => {
    const handleClearTooltip = () => {
      setActiveTooltip(false);
      setActiveIndex(null);
    };
    
    document.addEventListener('clearTooltip', handleClearTooltip);
    return () => {
      document.removeEventListener('clearTooltip', handleClearTooltip);
    };
  }, []);
  
  const handleClick = (data: any, index: number) => {
    setActiveIndex(index);
    setActiveTooltip(true);
  };
  
  return (
    <Card className="bg-gradient-to-br from-card to-muted/80 backdrop-blur-sm border-orange-400/30">
      <CardHeader>
        <CardTitle className="text-orange-300">Provider Comparison</CardTitle>
        <CardDescription>
          Average price per GB VRAM across providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
              onClick={() => {
                if (activeTooltip) {
                  setActiveTooltip(false);
                  setActiveIndex(null);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis
                type="category" 
                dataKey="provider"
                name="Provider"
                stroke="#888"
                tick={(props) => {
                  const { x, y, payload } = props;
                  const provider = payload.value;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <a 
                        href={getProviderUrl(provider)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <text 
                          x={0} 
                          y={0} 
                          dy={16} 
                          textAnchor="middle" 
                          fill="#aaa"
                          className="hover:fill-primary cursor-pointer"
                        >
                          {provider}
                        </text>
                      </a>
                    </g>
                  );
                }}
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
              {activeTooltip && activeIndex !== null && (
                <Tooltip 
                  content={<ComparisonTooltip 
                    active={true}
                    payload={[{ payload: providerStats[activeIndex] }]}
                  />}
                  wrapperStyle={{ zIndex: 1001 }}
                />
              )}
              <Scatter
                name="Providers"
                data={providerStats}
                fill="#8884d8"
                onClick={handleClick}
                cursor="pointer"
              >
                {providerStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || '#8884d8'} 
                    opacity={activeIndex === index ? 1 : 0.7}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-green-400">Key Insights</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <span className="text-green-400 font-medium">{providerStats[0]?.provider}</span> offers the best average price per GB VRAM at <span className="text-green-400 font-medium">${providerStats[0]?.avgPricePerGB.toFixed(3)}</span>
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  The market average is <span className="text-orange-300 font-medium">
                    ${(providerStats.reduce((sum, p) => sum + p.avgPricePerGB, 0) / providerStats.length).toFixed(3)}
                  </span> per GB VRAM
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-orange-300">Provider Links</h3>
            <ul className="space-y-1 text-sm">
              {providerStats.slice(0, 4).map(provider => (
                <li key={provider.provider} className="flex items-center gap-2">
                  <a 
                    href={getProviderUrl(provider.provider)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {provider.provider}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-xs text-muted-foreground">
                    ${provider.avgPricePerGB.toFixed(3)}/GB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderComparisonChart;
