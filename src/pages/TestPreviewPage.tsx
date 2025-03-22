
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import TestPreview from "@/components/TestPreview";
import { Test } from '@/services/geminiService';

const TestPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const test = location.state?.test as Test | undefined;
  
  useEffect(() => {
    if (!test) {
      navigate('/');
    }
  }, [test, navigate]);
  
  if (!test) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col px-4 pt-16 pb-12">
        <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="space-x-2 button-animation text-lavender-700 hover:text-lavender-800 hover:bg-lavender-50 print:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>Back to Generator</span>
          </Button>
          
          <TestPreview test={test} />
        </div>
      </main>
      
      <footer className="py-6 border-t border-lavender-100 bg-white/30 backdrop-blur-sm mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="text-sm text-lavender-600">
            TestGen — AI-powered test generation
          </p>
          <p className="text-sm text-lavender-600">
            Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TestPreviewPage;
