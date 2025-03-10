
import React from 'react';
import { BarChart3, Github } from 'lucide-react';

const PageFooter: React.FC = () => {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-medium">COMpare</span>
          <span className="text-sm text-muted-foreground">steal this code</span>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-1">
          <div className="flex items-center gap-4">
            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>
          <span className="text-sm text-primary/80">Powered by Commune</span>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
