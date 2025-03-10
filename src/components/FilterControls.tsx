
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { Sliders, Search, X, Filter, ArrowDownUp } from 'lucide-react';
import { formatVRam, formatPriceShort } from '@/utils/formatters';

interface FilterControlsProps {
  onFilterChange: (filters: FilterState) => void;
  providers: string[];
  maxVram: number;
  maxPrice: number;
}

interface FilterState {
  vramRange: [number, number];
  priceRange: [number, number];
  searchTerm: string;
  selectedProviders: string[];
  sortBy: 'price' | 'price-per-gb' | 'vram';
  sortDirection: 'asc' | 'desc';
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  onFilterChange, 
  providers = [], 
  maxVram = 80, 
  maxPrice = 5 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    vramRange: [0, maxVram],
    priceRange: [0, maxPrice],
    searchTerm: '',
    selectedProviders: [],
    sortBy: 'price-per-gb',
    sortDirection: 'asc'
  });

  const handleChange = (newPartialState: Partial<FilterState>) => {
    const newState = { ...filters, ...newPartialState };
    setFilters(newState);
    onFilterChange(newState);
  };

  const toggleProvider = (provider: string) => {
    const currentProviders = [...filters.selectedProviders];
    const index = currentProviders.indexOf(provider);
    
    if (index >= 0) {
      currentProviders.splice(index, 1);
    } else {
      currentProviders.push(provider);
    }
    
    handleChange({ selectedProviders: currentProviders });
  };

  const resetFilters = () => {
    const resetState: FilterState = {
      vramRange: [0, maxVram],
      priceRange: [0, maxPrice],
      searchTerm: '',
      selectedProviders: [],
      sortBy: 'price-per-gb',
      sortDirection: 'asc'
    };
    
    setFilters(resetState);
    onFilterChange(resetState);
  };
  
  const toggleSort = (sortKey: FilterState['sortBy']) => {
    if (filters.sortBy === sortKey) {
      // Toggle direction if already sorting by this key
      handleChange({ 
        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      // Set new sort key with ascending direction
      handleChange({ 
        sortBy: sortKey,
        sortDirection: 'asc'
      });
    }
  };

  return (
    <div className="w-full mb-6 transition-all duration-300">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5"
          >
            <Sliders className="h-4 w-4" />
            <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
          </Button>
          
          {filters.selectedProviders.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Providers:</span>
              <div className="flex flex-wrap gap-1">
                {filters.selectedProviders.map(provider => (
                  <span key={provider} className="pill bg-secondary text-secondary-foreground">
                    {provider}
                    <button
                      onClick={() => toggleProvider(provider)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
        </div>
      </div>
      
      {/* Search bar - always visible */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search GPUs, providers, or regions..."
          value={filters.searchTerm}
          onChange={(e) => handleChange({ searchTerm: e.target.value })}
          className="pl-10 h-10"
        />
        {filters.searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => handleChange({ searchTerm: '' })}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Expanded filters */}
      <div 
        className={cn(
          "grid gap-6 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 grid gap-6 md:grid-cols-2">
          {/* VRAM Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="vram-range">VRAM (GB)</Label>
              <span className="text-sm text-muted-foreground">
                {formatVRam(filters.vramRange[0])} - {formatVRam(filters.vramRange[1])}
              </span>
            </div>
            <Slider
              id="vram-range"
              min={0}
              max={maxVram}
              step={1}
              value={[filters.vramRange[0], filters.vramRange[1]]}
              onValueChange={(value) => handleChange({ vramRange: [value[0], value[1]] })}
              className="py-4"
            />
          </div>
          
          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="price-range">Price per Hour</Label>
              <span className="text-sm text-muted-foreground">
                {formatPriceShort(filters.priceRange[0])} - {formatPriceShort(filters.priceRange[1])}
              </span>
            </div>
            <Slider
              id="price-range"
              min={0}
              max={maxPrice}
              step={0.1}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={(value) => handleChange({ priceRange: [value[0], value[1]] })}
              className="py-4"
            />
          </div>
        </div>
        
        {/* Provider Selection */}
        <div>
          <Label className="mb-2 block">Providers</Label>
          <div className="flex flex-wrap gap-2">
            {providers.map(provider => (
              <button
                key={provider}
                onClick={() => toggleProvider(provider)}
                className={cn(
                  "pill transition-colors",
                  filters.selectedProviders.includes(provider)
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
                )}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort Options */}
        <div>
          <Label className="mb-2 block">Sort By</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'price' as const, label: 'Price' },
              { key: 'price-per-gb' as const, label: 'Price per GB' },
              { key: 'vram' as const, label: 'VRAM Size' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={cn(
                  "pill flex items-center gap-1.5 transition-colors",
                  filters.sortBy === key
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
                )}
              >
                {label}
                {filters.sortBy === key && (
                  <ArrowDownUp className={cn(
                    "h-3 w-3 transition-transform", 
                    filters.sortDirection === 'desc' && "rotate-180"
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
