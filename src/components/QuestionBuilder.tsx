import React, { useState } from 'react';
import axios from 'axios';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QuestionBuilder: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');

  const generateQuestion = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:3000/api/questions/generate', {
        topic,
        difficulty
      });

      setGeneratedQuestion(response.data);
    } catch (err) {
      setError('Failed to generate question. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
          className="border p-2 mr-2"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          onClick={generateQuestion}
          disabled={loading || !topic}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Generating...' : 'Generate Question'}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {generatedQuestion && (
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Generated Question:</h2>
          <p className="mb-4">{generatedQuestion.question}</p>
          
          <h3 className="font-bold mb-2">Options:</h3>
          <ul className="list-disc pl-5 mb-4">
            {generatedQuestion.options.map((option, index) => (
              <li key={index} className={option === generatedQuestion.correctAnswer ? 'text-green-600' : ''}>
                {option}
              </li>
            ))}
          </ul>
          
          <h3 className="font-bold mb-2">Explanation:</h3>
          <p>{generatedQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionBuilder;
