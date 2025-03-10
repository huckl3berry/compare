
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface ResultDisplayProps {
  result: any;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error }) => {
  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-semibold">Error:</h3>
        <p className="mt-1">{error}</p>
        <p className="text-sm mt-2 text-red-600">
          Check the browser console for more details.
        </p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">Scrape Result:</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
          className="flex items-center"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          Copy JSON
        </Button>
      </div>
      <Card className="p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default ResultDisplay;
