
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import About from './pages/About';
import TestScrape from './pages/TestScrape';
import DetailedAnalysis from './pages/DetailedAnalysis';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/test-scrape" element={<TestScrape />} />
        <Route path="/detailed-analysis" element={<DetailedAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" closeButton />
    </AuthProvider>
  );
}

export default App;
