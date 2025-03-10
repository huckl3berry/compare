
import React from 'react';
import { TableHead } from "@/components/ui/table";
import { ArrowDown, ArrowUp } from 'lucide-react';

export type SortKey = 'provider' | 'gpuModel' | 'vramGB' | 'pricePerHour' | 'pricePerGBVram' | 'region';

interface SortableTableHeaderProps {
  label: string;
  sortKey: SortKey;
  currentSortConfig: {
    key: SortKey;
    direction: 'asc' | 'desc';
  };
  onSort: (key: SortKey) => void;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  label,
  sortKey,
  currentSortConfig,
  onSort
}) => {
  const getSortIcon = () => {
    if (currentSortConfig.key !== sortKey) {
      return null;
    }
    
    return currentSortConfig.direction === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 ml-1" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 ml-1" />
    );
  };

  return (
    <TableHead 
      className="font-medium cursor-pointer hover:text-primary transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon()}
      </div>
    </TableHead>
  );
};

export default SortableTableHeader;
