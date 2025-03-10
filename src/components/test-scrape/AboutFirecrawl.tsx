
import React from 'react';
import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const AboutFirecrawl: React.FC = () => {
  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold">About Firecrawl SDK</h2>
      </div>
      
      <p className="mb-4">
        This application uses the Firecrawl SDK to scrape web pages. The SDK provides a simple 
        interface for converting websites into structured data, which is then used to power 
        the GPU price comparison features.
      </p>
      
      <h3 className="text-lg font-medium mt-6 mb-2">Key Features:</h3>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Simple URL scraping</li>
        <li>Website crawling</li>
        <li>HTML to structured data conversion</li>
        <li>Support for JavaScript-rendered content</li>
        <li>Integration with Supabase edge functions for secure API usage</li>
      </ul>
      
      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          SDK Documentation: <a href="https://firecrawl.dev/docs" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://firecrawl.dev/docs</a>
        </p>
      </div>
    </Card>
  );
};

export default AboutFirecrawl;
