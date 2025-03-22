import { toast } from 'sonner';

export interface Question {
  question: string;
  options?: string[];
  answer?: string;
  correctAnswer?: string; // Support for both answer formats
  explanation?: string;
}

export interface Test {
  title: string;
  subject: string;
  questions: Question[];
}

// You should replace this with your actual Gemini API key in a real backend implementation
// This is a placeholder for demonstration purposes
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function generateTest(subject: string, questionCount: number): Promise<Test> {
  try {
    // Limit request to a reasonable number
    const validQuestionCount = Math.min(Math.max(1, questionCount), 10);
    
    if (validQuestionCount < questionCount) {
      toast.info(`Note: Currently limited to generating a maximum of 10 questions at once`);
    }
    
    toast.info(`Generating ${validQuestionCount} questions about ${subject}...`);
    
    const response = await fetch('http://localhost:3000/api/questions/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: subject,
        difficulty: 'medium', // You can make this a parameter if needed
        questionCount: validQuestionCount
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      toast.error(errorData.details || 'Failed to generate test');
      throw new Error(errorData.details || 'Failed to generate test');
    }

    const data = await response.json();
    
    // Transform the response to match the expected Test format if needed
    const testData: Test = {
      title: data.title || `${subject} Test`,
      subject: data.subject || subject,
      questions: Array.isArray(data.questions) ? data.questions : [data]
    };
    
    // Make sure we have questions
    if (!testData.questions || testData.questions.length === 0) {
      toast.error('No questions were generated');
      throw new Error('No questions were generated');
    }
    
    // Normalize question format (handle both answer and correctAnswer fields)
    testData.questions = testData.questions.map(q => {
      if (q.correctAnswer && !q.answer) {
        return {
          ...q,
          answer: q.correctAnswer
        };
      }
      return q;
    });
    
    toast.success(`Generated ${testData.questions.length} questions successfully`);
    return testData;
  } catch (error) {
    console.error('Error in generateTest:', error);
    throw error;
  }
}
