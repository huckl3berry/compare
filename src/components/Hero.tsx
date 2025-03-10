
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      containerRef.current.style.setProperty('--x', `${x * 5}deg`);
      containerRef.current.style.setProperty('--y', `${-y * 5}deg`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section className="relative py-16 md:py-24 flex flex-col items-center justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center z-10">
        <div className="space-y-3 mb-8">
          <div 
            className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-sm px-3 py-1 text-sm text-green-400 animate-fade-in" 
            style={{ '--index': 0 } as React.CSSProperties}
          >
            <span className="font-medium">Find the best GPU deals</span>
            <span className="mx-2 text-green-500/50">•</span>
            <span className="text-green-400/80">Powered by Commune</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up text-green-500"
            style={{ '--index': 1 } as React.CSSProperties}
          >
            Compare GPU Rentals <br />by VRAM Pricing
          </h1>
          <p 
            className="text-xl text-muted-foreground max-w-[42rem] mx-auto animate-slide-up"
            style={{ '--index': 2 } as React.CSSProperties}
          >
            Find the most cost-effective GPU rentals across multiple cloud providers with our realtime comparison tool.
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/20 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent z-0" />
    </section>
  );
};

export default Hero;
