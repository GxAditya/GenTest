import express from 'express';
import { generateQuestion } from '../services/gemini';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { topic, difficulty, questionCount = 1 } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'Topic and difficulty are required' });
    }

    // For a single question request
    if (questionCount === 1) {
      const question = await generateQuestion(topic, difficulty, 0);
      return res.json(question);
    }
    
    // For multiple questions (test generation)
    const questions = [];
    const validQuestionCount = Math.min(Math.max(1, questionCount), 10); // Limit to 10 questions max
    
    // Determine if the topic might contain multiple subjects
    const potentialSubjectsInTopic = topic.includes(' and ') || 
                                    topic.includes(',') || 
                                    topic.includes('/') || 
                                    topic.includes('&');
                                    
    console.log(`Topic "${topic}" might contain multiple subjects: ${potentialSubjectsInTopic}`);
    
    // Generate questions sequentially
    for (let i = 0; i < validQuestionCount; i++) {
      try {
        // For each question, we'll slightly modify the topic to encourage diversity
        // if multiple subjects are detected
        let currentTopic = topic;
        if (potentialSubjectsInTopic && i > 0) {
          currentTopic = `${topic} (Please choose a different subject than previous questions for variety)`;
        }
        
        const question = await generateQuestion(currentTopic, difficulty, i);
        questions.push(question);
      } catch (err) {
        console.error(`Error generating question ${i+1}:`, err);
        // If we have at least one question, return what we have
        if (questions.length > 0) break;
        throw err; // Otherwise rethrow
      }
    }
    
    res.json({
      title: `${topic} Test (${difficulty} difficulty)`,
      subject: topic,
      questions: questions
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate question',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
