
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  apiKey,
  onSaveApiKey
}) => {
  const [newApiKey, setNewApiKey] = useState('');
  
  const saveApiKey = () => {
    if (newApiKey.trim()) {
      onSaveApiKey(newApiKey);
      toast.success('API key updated successfully');
      onOpenChange(false);
    } else {
      toast.error('Please enter a valid API key');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 right-4">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your Perplexity API key for improved recommendations
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Perplexity API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Get your API key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">Perplexity API settings</a>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveApiKey}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
