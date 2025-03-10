
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getProviderColor } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ProviderBadgesProps {
  providers: string[];
  selectedProviders: string[];
  onToggleProvider: (provider: string) => void;
}

const ProviderBadges: React.FC<ProviderBadgesProps> = ({
  providers,
  selectedProviders,
  onToggleProvider
}) => {
  if (providers.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {providers.map(provider => (
        <Badge 
          key={provider}
          variant={selectedProviders.includes(provider) ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-all",
            selectedProviders.includes(provider) && "bg-opacity-90"
          )}
          style={{
            backgroundColor: selectedProviders.includes(provider) 
              ? getProviderColor(provider) 
              : undefined
          }}
          onClick={() => onToggleProvider(provider)}
        >
          {provider}
        </Badge>
      ))}
    </div>
  );
};

export default ProviderBadges;
