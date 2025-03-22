
import { useEffect, useState } from 'react';

interface LoadingStateProps {
  subject: string;
  count: number;
}

const messages = [
  "Analyzing subject matter...",
  "Formulating questions...",
  "Ensuring accuracy and relevance...",
  "Calibrating difficulty levels...",
  "Almost there..."
];

const LoadingState = ({ subject, count }: LoadingStateProps) => {
  const [message, setMessage] = useState(messages[0]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setMessage(messages[messageIndex]);
    }, 3000);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Slow down progress as it approaches 100%
        const increment = prev < 70 ? 10 : prev < 90 ? 5 : 2;
        return Math.min(prev + increment, 95);
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto h-[400px] flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-medium tracking-tight text-lavender-800">Generating Your Test</h3>
          <p className="text-lavender-600">
            Creating {count} {count === 1 ? 'question' : 'questions'} about {subject}
          </p>
        </div>
        
        <div className="relative w-64 h-1.5 bg-lavender-100 mx-auto rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-lavender-500 rounded-full"
            style={{ width: `${progress}%`, transition: "width 0.5s ease" }}
          />
        </div>
        
        <p className="text-sm animate-pulse text-lavender-700">{message}</p>
        
        <div className="w-12 h-12 mx-auto text-lavender-600">
          <svg 
            className="animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
