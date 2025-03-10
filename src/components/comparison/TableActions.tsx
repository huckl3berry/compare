
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProviderBadges from './ProviderBadges';

interface TableActionsProps {
  isTableExpanded: boolean;
  toggleTableExpansion: () => void;
  viewMode: 'all' | 'compare';
  onViewChange: (value: string) => void;
  dataLength: number;
  providers: string[];
  selectedProviders: string[];
  onToggleProvider: (provider: string) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  isTableExpanded,
  toggleTableExpansion,
  viewMode,
  onViewChange,
  dataLength,
  providers,
  selectedProviders,
  onToggleProvider
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Compare GPU Offerings</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          onClick={toggleTableExpansion}
        >
          {isTableExpanded ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
          <span>{isTableExpanded ? "Collapse" : "Expand"} Comparison Table</span>
        </Button>
      </div>
      
      {isTableExpanded ? (
        <Tabs defaultValue="all" onValueChange={onViewChange}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Providers</TabsTrigger>
              <TabsTrigger value="compare">Compare Specific Providers</TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              {viewMode === 'all' ? 
                `Showing all ${dataLength} offerings` : 
                `Comparing ${selectedProviders.length} providers`
              }
            </div>
          </div>
          
          <TabsContent value="compare" className="mt-4">
            <ProviderBadges 
              providers={providers}
              selectedProviders={selectedProviders}
              onToggleProvider={onToggleProvider}
            />
            
            {selectedProviders.length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">Select providers above to start comparing</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <p className="text-muted-foreground text-sm">
          Click to expand and compare detailed GPU pricing across providers.
        </p>
      )}
    </div>
  );
};

export default TableActions;
