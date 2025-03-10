
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import AboutHeader from '@/components/about/AboutHeader';
import ProjectOverview from '@/components/about/ProjectOverview';
import DataSources from '@/components/about/DataSources';
import TechnologyStack from '@/components/about/TechnologyStack';
import PageFooter from '@/components/about/PageFooter';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl py-24 px-4 md:px-6">
        <div className="space-y-12 animate-fade-in">
          <AboutHeader />
          
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About the Project</TabsTrigger>
              <TabsTrigger value="data">Data Sources</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <ProjectOverview />
            </TabsContent>
            
            <TabsContent value="data">
              <DataSources />
            </TabsContent>
            
            <TabsContent value="tech">
              <TechnologyStack />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default About;
