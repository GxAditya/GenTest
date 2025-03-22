
import Header from "@/components/Header";
import TestForm from "@/components/TestForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12 relative">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto animate-slide-down">
            <div className="inline-block bg-lavender-100 px-4 py-1.5 rounded-full text-xs font-medium text-lavender-700 mb-3">
              AI-Powered Test Generation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-lavender-900">
              Create Custom Tests in Seconds
            </h1>
            <p className="text-lavender-700 mt-4 max-w-lg mx-auto">
              Generate comprehensive tests for any subject with precise control over
              question count and content. Perfect for educators and students.
            </p>
          </div>
          
          <TestForm />
        </div>
      </main>
      
      <footer className="py-6 border-t border-lavender-100 bg-white/30 backdrop-blur-sm mt-auto">
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

export default Index;
