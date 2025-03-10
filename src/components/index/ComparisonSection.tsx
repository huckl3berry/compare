
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceChart from '@/components/PriceChart';
import ComparisonTable from '@/components/ComparisonTable';
import FilterControls from '@/components/FilterControls';
import { GPUData, GPUDataService } from '@/services/GPUDataService';
import { BarChart3, Filter, RefreshCw, Lock, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

interface ComparisonSectionProps {
  gpuData: GPUData[];
  filteredData: GPUData[];
  loading: boolean;
  providers: string[];
  onFilterChange: (newFilters: any) => void;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  gpuData,
  filteredData,
  loading,
  providers,
  onFilterChange
}) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const isAdmin = profile?.is_admin === true;
  
  // Add state to track force update loading state
  const [isForceUpdating, setIsForceUpdating] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Handler for force update button
  const handleForceUpdate = async () => {
    // Only allow admins to force update
    if (!isAdmin) {
      toast.error('You do not have permission to perform this action');
      return;
    }
    
    setShowAdminDialog(false);
    setIsForceUpdating(true);
    
    try {
      await GPUDataService.forceUpdateAllData();
      toast.success('Data update complete');
    } catch (error) {
      console.error('Error forcing update:', error);
      toast.error('Failed to update data');
    } finally {
      setIsForceUpdating(false);
    }
  };

  // Handle admin button click - either show login or confirmation dialog
  const handleAdminButtonClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else if (isAdmin) {
      setShowAdminDialog(true);
    } else {
      toast.error('You do not have admin privileges');
    }
  };

  return (
    <section className="py-16 relative">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Price Comparison</h2>
            <div className="flex gap-2">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleAdminButtonClick}
                    disabled={isForceUpdating || loading}
                  >
                    <Lock className="h-4 w-4" />
                    Admin Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setShowAuthModal(true)}
                >
                  <LogIn className="h-4 w-4" />
                  Admin Login
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">
            Compare GPU rental prices across multiple providers
          </p>
        </div>
        
        {/* Admin confirmation dialog */}
        <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Data Update</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to force update all GPU data? This will make API calls to all providers.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleForceUpdate}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isForceUpdating ? 'animate-spin' : ''}`} />
                Force Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Auth Modal */}
        <AuthModal 
          open={showAuthModal} 
          onOpenChange={setShowAuthModal}
        />
        
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <PriceChart data={gpuData} />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Pricing Insights</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <p className="text-sm text-muted-foreground">
                  Our analysis shows significant price variations across providers for the same GPU models.
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Findings:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Price per GB VRAM can vary up to 300% between providers</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Newer GPU models often have better VRAM pricing efficiency</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Regional pricing differences can be significant</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Prices are updated automatically once per day.
                  <br/>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="pt-4 mt-auto">
                <Button className="w-full" onClick={() => navigate('/detailed-analysis')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <FilterControls 
            onFilterChange={onFilterChange}
            providers={providers}
            maxVram={80}
            maxPrice={5}
          />
          
          {loading || isForceUpdating ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {gpuData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <p className="text-muted-foreground">No GPU data available</p>
                  {isAdmin && (
                    <Button onClick={handleForceUpdate} className="gap-2">
                      <RefreshCw className={`h-4 w-4 ${isForceUpdating ? 'animate-spin' : ''}`} />
                      Initialize Data
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <ComparisonTable data={filteredData} />
                  
                  {filteredData.length > 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing {filteredData.length} of {gpuData.length} GPU offerings
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      No results match your current filters. Try adjusting your search criteria.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
