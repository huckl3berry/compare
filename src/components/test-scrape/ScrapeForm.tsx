
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';

interface ScrapeFormProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  onTestScrape: () => Promise<void>;
  onCustomScrape: () => Promise<void>;
}

const ScrapeForm: React.FC<ScrapeFormProps> = ({
  url,
  setUrl,
  loading,
  onTestScrape,
  onCustomScrape
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Basic Example.com Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tests the SDK with a simple request to example.com
        </p>
        <Button 
          onClick={onTestScrape} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Example.com Scrape'
          )}
        </Button>
      </Card>
      
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Custom URL Test</h2>
        <div className="flex flex-col space-y-4">
          <Input
            placeholder="Enter URL to scrape"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button 
            onClick={onCustomScrape} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                Scrape Custom URL
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ScrapeForm;
