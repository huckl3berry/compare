
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, ArrowRight } from 'lucide-react';

const DataSources = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Collection
          </CardTitle>
          <CardDescription>
            How we collect and process pricing data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We use the FireCrawl API to scrape pricing data from various cloud GPU providers. The data is collected regularly to ensure it remains up-to-date and accurate.
          </p>
          <p>
            After collection, the data is normalized and processed to ensure consistent comparison metrics across all providers, such as price per GB of VRAM.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported Providers</CardTitle>
          <CardDescription>
            We currently collect data from the following cloud GPU providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "DatabaseMart",
              "Digital Ocean",
              "Runpod",
              "Vast",
              "Valdi",
              "Coreweave",
              "Nebius",
              "Tencent Cloud"
            ].map((provider) => (
              <div key={provider} className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>{provider}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSources;
