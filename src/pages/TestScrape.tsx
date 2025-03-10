import React, { useState } from 'react';
import { FirecrawlService } from '@/services/FirecrawlService';
import { FirecrawlAPI } from '@/services/firecrawl/api';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrapeForm from '@/components/test-scrape/ScrapeForm';
import AboutFirecrawl from '@/components/test-scrape/AboutFirecrawl';
import ResultDisplay from '@/components/test-scrape/ResultDisplay';
import PageFooter from '@/components/PageFooter';

const TestScrape = () => {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('scrape');

  const handleTestScrape = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing basic scrape with Firecrawl API');
      const response = await FirecrawlService.testScrape();
      console.log('Test scrape response:', response);
      
      if (response.success) {
        setResult(response.data);
        toast.success('Success! Scraped example.com');
      } else {
        setError(response.error || 'Unknown error occurred');
        toast.error('Scraping failed');
      }
    } catch (err) {
      console.error('Error in test scrape:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Error occurred during scraping');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomScrape = async () => {
    if (!url) {
      setError('Please enter a URL');
      toast.error('Please enter a URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log(`Testing custom scrape for URL: ${url}`);
      const response = await FirecrawlAPI.callTestScrape(url);
      console.log('Custom scrape response:', response);
      
      if (response.success) {
        setResult(response.data);
        toast.success(`Successfully scraped ${url}`);
      } else {
        setError(response.error || 'Unknown error occurred');
        toast.error('Scraping failed');
      }
    } catch (err) {
      console.error('Error in custom scrape:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Error occurred during scraping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Firecrawl SDK</h1>
        
        <Tabs defaultValue="scrape" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="scrape">Scrape Test</TabsTrigger>
            <TabsTrigger value="about">About Firecrawl</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scrape">
            <ScrapeForm 
              url={url}
              setUrl={setUrl}
              loading={loading}
              onTestScrape={handleTestScrape}
              onCustomScrape={handleCustomScrape}
            />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutFirecrawl />
          </TabsContent>
        </Tabs>
        
        {(error || result) && activeTab === 'scrape' && (
          <ResultDisplay result={result} error={error} />
        )}
      </main>
      
      <PageFooter />
    </div>
  );
};

export default TestScrape;
