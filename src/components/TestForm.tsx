import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import LoadingState from './LoadingState';
import { generateTest } from '@/services/geminiService';

interface FormData {
  subject: string;
  questionCount: number;
}

const TestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    questionCount: 5,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, questionCount: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (formData.questionCount < 1 || formData.questionCount > 10) {
      toast.error('Please select between 1 and 10 questions');
      return;
    }

    setLoading(true);
    
    try {
      const test = await generateTest(formData.subject, formData.questionCount);
      
      if (!test || !test.questions || test.questions.length === 0) {
        throw new Error('No questions were generated');
      }
      
      navigate('/preview', { state: { test } });
    } catch (error) {
      console.error('Error generating test:', error);
      toast.error('Error generating test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState subject={formData.subject} count={formData.questionCount} />;
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in relative">
      {/* Double layer background effect - Shadow layer */}
      <div className="absolute -bottom-3 -right-3 w-full h-full bg-lavender-300/30 rounded-3xl blur-sm"></div>
      
      {/* Double layer background effect - Accent layer */}
      <div className="absolute -top-3 -left-3 w-full h-full bg-lavender-200/40 rounded-3xl blur-sm"></div>
      
      <Card className="border border-lavender-200 bg-white/95 backdrop-blur-sm shadow-lg rounded-3xl overflow-hidden relative z-10">
        <CardContent className="pt-6 pb-8 px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="subject" 
                className="text-sm font-medium inline-block pb-1 text-lavender-700"
              >
                Subject or Exam Title
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="E.g., Math and Science, History/Geography, GMAT"
                value={formData.subject}
                onChange={handleInputChange}
                className="bg-white/80 border-lavender-200 rounded-xl input-focus-ring focus-visible:ring-lavender-400"
              />
              <p className="text-xs text-lavender-600 mt-1">
                Tip: For a mixed-subject test, enter multiple subjects separated by commas or "and" (e.g., "Math, Science, and History")
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label 
                  htmlFor="questionCount" 
                  className="text-sm font-medium text-lavender-700"
                >
                  Number of Questions
                </Label>
                <span className="text-2xl font-medium text-lavender-800">
                  {formData.questionCount}
                </span>
              </div>
              
              <Slider
                id="questionCount"
                min={1}
                max={10}
                step={1}
                value={[formData.questionCount]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-lavender-600/70 px-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full button-animation bg-lavender-600 hover:bg-lavender-700 text-white rounded-xl h-12"
            >
              Generate Test
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestForm;
