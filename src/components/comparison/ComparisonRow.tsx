
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, getProviderColor } from '@/utils/formatters';

interface ComparisonData {
  id: number;
  provider: string;
  providerUrl?: string;
  gpuModel: string;
  vramGB: number;
  pricePerHour: number;
  pricePerGBVram: number;
  region: string;
  scrapeTimestamp: string;
}

interface BestValues {
  lowestPricePerHour?: number;
  lowestPricePerGBVram?: number;
  highestVRam?: number;
}

interface ComparisonRowProps {
  row: ComparisonData;
  index: number;
  bestValues: BestValues;
  viewMode: 'all' | 'compare';
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({
  row,
  index,
  bestValues,
  viewMode
}) => {
  return (
    <TableRow 
      className={cn(
        "group transition-colors",
        index % 2 === 0 ? "bg-background" : "bg-muted/20",
        "hover:bg-muted/40"
      )}
    >
      <TableCell className="font-medium">
        <div 
          className="flex items-center gap-1.5"
          style={{ 
            color: viewMode === 'compare' ? getProviderColor(row.provider) : undefined
          }}
        >
          {row.provider}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{row.gpuModel}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn(
          "font-normal",
          bestValues.highestVRam === row.vramGB && "border-green-500 text-green-600"
        )}>
          {row.vramGB} GB
          {bestValues.highestVRam === row.vramGB && viewMode === 'compare' && (
            <CheckCircle className="h-3 w-3 ml-1 inline text-green-500" />
          )}
        </Badge>
      </TableCell>
      <TableCell className={cn(
        bestValues.lowestPricePerHour === row.pricePerHour && viewMode === 'compare' && "font-medium text-green-600"
      )}>
        {formatPrice(row.pricePerHour)}
        {bestValues.lowestPricePerHour === row.pricePerHour && viewMode === 'compare' && (
          <CheckCircle className="h-3 w-3 ml-1 inline text-green-500" />
        )}
      </TableCell>
      <TableCell className={cn(
        bestValues.lowestPricePerGBVram === row.pricePerGBVram && viewMode === 'compare' && "font-medium text-green-600"
      )}>
        {formatPrice(row.pricePerGBVram)}
        {bestValues.lowestPricePerGBVram === row.pricePerGBVram && viewMode === 'compare' && (
          <CheckCircle className="h-3 w-3 ml-1 inline text-green-500" />
        )}
      </TableCell>
      <TableCell>{row.region}</TableCell>
      <TableCell className="text-right">
        {row.providerUrl && (
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 group-hover:bg-secondary" asChild>
            <a href={row.providerUrl} target="_blank" rel="noopener noreferrer">
              <span className="text-xs">Visit</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ComparisonRow;
