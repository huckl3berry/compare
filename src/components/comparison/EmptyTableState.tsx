
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

interface EmptyTableStateProps {
  viewMode: 'all' | 'compare';
  selectedProviders: string[];
}

const EmptyTableState: React.FC<EmptyTableStateProps> = ({ 
  viewMode, 
  selectedProviders 
}) => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center">
        {viewMode === 'compare' && selectedProviders.length === 0 
          ? "Select providers to compare" 
          : "No results found"}
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableState;
