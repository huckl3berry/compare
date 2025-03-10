
import React from 'react';
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { useComparisonTable, SortKey } from './useComparisonTable';
import TableActions from './TableActions';
import SortableTableHeader from './SortableTableHeader';
import ComparisonRow from './ComparisonRow';
import EmptyTableState from './EmptyTableState';

export interface ComparisonData {
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

interface ComparisonTableProps {
  data: ComparisonData[];
  className?: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, className }) => {
  const {
    sortConfig,
    sortedData,
    providers,
    selectedProviders,
    viewMode,
    isTableExpanded,
    bestValues,
    requestSort,
    toggleProviderSelection,
    handleViewChange,
    toggleTableExpansion
  } = useComparisonTable(data);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-lg border overflow-hidden bg-card">
        <TableActions
          isTableExpanded={isTableExpanded}
          toggleTableExpansion={toggleTableExpansion}
          viewMode={viewMode}
          onViewChange={handleViewChange}
          dataLength={data.length}
          providers={providers}
          selectedProviders={selectedProviders}
          onToggleProvider={toggleProviderSelection}
        />

        {isTableExpanded && (
          <div className="table-wrapper">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {[
                    { key: 'provider', label: 'Provider' },
                    { key: 'gpuModel', label: 'GPU Model' },
                    { key: 'vramGB', label: 'VRAM' },
                    { key: 'pricePerHour', label: 'Price/Hour' },
                    { key: 'pricePerGBVram', label: 'Price/GB VRAM' },
                    { key: 'region', label: 'Region' },
                  ].map(({ key, label }) => (
                    <SortableTableHeader
                      key={key}
                      label={label}
                      sortKey={key as SortKey}
                      currentSortConfig={sortConfig}
                      onSort={requestSort}
                    />
                  ))}
                  <SortableTableHeader
                    label="Actions"
                    sortKey={'provider' as SortKey}
                    currentSortConfig={{ key: 'none' as SortKey, direction: 'asc' }}
                    onSort={() => {}}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length > 0 ? (
                  sortedData.map((row, index) => (
                    <ComparisonRow
                      key={row.id}
                      row={row}
                      index={index}
                      bestValues={bestValues}
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <EmptyTableState
                    viewMode={viewMode}
                    selectedProviders={selectedProviders}
                  />
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;
