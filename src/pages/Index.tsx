
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { useGPUData } from '@/components/index/useGPUData';
import ProviderSection from '@/components/index/ProviderSection';
import ComparisonSection from '@/components/index/ComparisonSection';
import PageFooter from '@/components/index/PageFooter';
import GPUChatbotTile from '@/components/index/GPUChatbotTile';

const Index = () => {
  const {
    gpuData,
    filteredData,
    loading,
    providers,
    providerStats,
    filters,
    handleFilterChange
  } = useGPUData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Provider Section with Featured GPU Chatbot Tile */}
        <ProviderSection 
          providerStats={providerStats} 
          chatbotTile={
            <GPUChatbotTile 
              onFilterRecommendation={handleFilterChange}
              gpuData={gpuData}
            />
          }
        />
        
        <ComparisonSection
          gpuData={gpuData}
          filteredData={filteredData}
          loading={loading}
          providers={providers}
          onFilterChange={handleFilterChange}
        />
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Index;
