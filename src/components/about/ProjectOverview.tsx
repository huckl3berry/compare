
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Layers, Github, ExternalLink } from 'lucide-react';

const ProjectOverview = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Project Overview
          </CardTitle>
          <CardDescription>
            The mission and purpose behind GPUCompare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            GPUCompare is a web application that aggregates and displays GPU rental pricing data from multiple cloud providers, with a special focus on comparing prices based on GPU VRAM.
          </p>
          <p>
            Our goal is to help AI researchers, data scientists, and GPU users find the most cost-effective GPU rental options for their specific needs, saving both time and money.
          </p>
          <p>
            By normalizing pricing data across providers and calculating metrics like price per GB of VRAM, we enable direct comparisons that would otherwise require visiting multiple provider websites.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Real-time price comparison across multiple providers</li>
              <li>Price per GB VRAM calculations</li>
              <li>Advanced filtering by GPU model, VRAM, provider, and price</li>
              <li>Visual price comparison charts</li>
              <li>Regular data updates using the FireCrawl API</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Github className="h-5 w-5 text-primary" />
              Open Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This project is open source and available on GitHub. We welcome contributions from the community.
            </p>
            <div className="flex justify-start">
              <a 
                href="https://github.com/username/gpucompare" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                View on GitHub <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectOverview;
