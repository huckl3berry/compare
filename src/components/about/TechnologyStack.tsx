
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Search, ExternalLink } from 'lucide-react';

const TechnologyStack = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            The technologies powering GPUCompare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Frontend</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>React with TypeScript</li>
                <li>Tailwind CSS for styling</li>
                <li>Recharts for data visualization</li>
                <li>React Router for navigation</li>
                <li>Shadcn UI component library</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Backend & Services</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Supabase for authentication and database</li>
                <li>FireCrawl API for data scraping</li>
                <li>GitHub Actions for CI/CD</li>
                <li>TypeScript for type safety</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            FireCrawl API Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We use the FireCrawl API to scrape GPU pricing data from various cloud providers. This allows us to collect accurate and up-to-date information without having to manually visit each provider's website.
          </p>
          <p>
            The data is processed and normalized to ensure consistent comparison metrics across all providers, such as price per GB of VRAM.
          </p>
          <div className="flex justify-start">
            <a 
              href="https://firecrawl.dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Learn more about FireCrawl <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnologyStack;
