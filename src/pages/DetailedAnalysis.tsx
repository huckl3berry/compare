
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ComparisonTable from '@/components/ComparisonTable';
import { GPUDataService, GPUData } from '@/services/GPUDataService';
import { ChevronLeft, BarChart3, TrendingUp, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProviderComparisonChart from '@/components/charts/ProviderComparisonChart';
import ValueDistributionChart from '@/components/charts/ValueDistributionChart';
import ModelEfficiencyChart from '@/components/charts/ModelEfficiencyChart';
import PriceCorrelationChart from '@/components/charts/PriceCorrelationChart';
import PageFooter from '@/components/index/PageFooter';
import { getProviderColor } from '@/utils/formatters';

const DetailedAnalysis = () => {
  const [gpuData, setGpuData] = useState<GPUData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GPUDataService.getAllGPUData();
        setGpuData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate provider stats
  const providerStats = React.useMemo(() => {
    if (!gpuData.length) return [];
    
    const providers = Array.from(new Set(gpuData.map(item => item.provider)));
    
    return providers.map(provider => {
      const providerData = gpuData.filter(item => item.provider === provider);
      const avgPricePerGB = providerData.reduce((sum, item) => sum + item.pricePerGBVram, 0) / providerData.length;
      const minPricePerGB = Math.min(...providerData.map(item => item.pricePerGBVram));
      const maxPricePerGB = Math.max(...providerData.map(item => item.pricePerGBVram));
      const avgVram = providerData.reduce((sum, item) => sum + item.vramGB, 0) / providerData.length;
      
      return {
        provider,
        gpuCount: providerData.length,
        avgPricePerGB,
        minPricePerGB,
        maxPricePerGB,
        avgVram,
        color: getProviderColor(provider)
      };
    }).sort((a, b) => a.avgPricePerGB - b.avgPricePerGB);
  }, [gpuData]);
  
  // Data for bubble chart
  const bubbleData = React.useMemo(() => {
    return gpuData.map(item => ({
      name: `${item.provider} ${item.gpuModel}`,
      vram: item.vramGB,
      pricePerHour: item.pricePerHour,
      pricePerGB: item.pricePerGBVram,
      provider: item.provider,
      model: item.gpuModel,
      z: 1
    }));
  }, [gpuData]);
  
  // Model efficiency data
  const modelEfficiencyData = React.useMemo(() => {
    if (!gpuData.length) return [];
    
    const models = Array.from(new Set(gpuData.map(item => item.gpuModel)));
    
    return models.map(model => {
      const modelData = gpuData.filter(item => item.gpuModel === model);
      const avgPricePerGB = modelData.reduce((sum, item) => sum + item.pricePerGBVram, 0) / modelData.length;
      const vram = modelData[0].vramGB; // VRAM should be the same for the same model
      
      return {
        model,
        avgPricePerGB,
        vram,
        count: modelData.length
      };
    }).sort((a, b) => a.avgPricePerGB - b.avgPricePerGB).slice(0, 10); // Top 10 most efficient models
  }, [gpuData]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Navbar />
      
      <main className="flex-1 container px-4 py-8">
        <div className="flex items-center mb-8 gap-4">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Overview
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight heading-gradient">
            Detailed GPU Pricing Analysis
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-10">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Provider Overview</span>
                </TabsTrigger>
                <TabsTrigger value="models" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Model Efficiency</span>
                </TabsTrigger>
                <TabsTrigger value="correlation" className="gap-2">
                  <LineChart className="h-4 w-4" />
                  <span>Price Correlation</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <ProviderComparisonChart providerStats={providerStats} />
                  <ValueDistributionChart bubbleData={bubbleData} />
                </div>
                
                <div className="mt-8">
                  <ComparisonTable data={gpuData} />
                </div>
              </TabsContent>
              
              <TabsContent value="models" className="space-y-6">
                <ModelEfficiencyChart modelEfficiencyData={modelEfficiencyData} />
              </TabsContent>
              
              <TabsContent value="correlation" className="space-y-6">
                <PriceCorrelationChart bubbleData={bubbleData} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DetailedAnalysis;
