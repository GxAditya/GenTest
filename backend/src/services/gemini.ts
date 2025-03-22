import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY?.trim();

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is missing or empty in .env file');
}

// Initialize API with safety check
let genAI: GoogleGenerativeAI;

async function initializeGenAI() {
  if (!API_KEY) {
    throw new Error('API_KEY is undefined');
  }
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Verify the API key by making a simple API call
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // Attempt a simple content generation to validate the API key
    try {
        const probeResult = await model.generateContent("Say hello");
        if (!probeResult || !probeResult.response) {
            console.error("API Key verification failed: No response");
            throw new Error("API Key verification failed: No response");
        }
    } catch (probeError: any) {
        console.error("API Key verification failed:", probeError);
        throw new Error(`API Key verification failed: ${probeError.message}`);
    }
    console.log("Gemini API client initialized successfully.");
  } catch (error: any) {
    console.error('Failed to initialize Gemini API:', error);
    throw new Error(`Failed to initialize Gemini API client: ${error.message}`);
  }
}

initializeGenAI();

export async function generateQuestion(topic: string, difficulty: string, questionIndex?: number) {
  try {
    if (API_KEY) {
      console.log('Attempting to generate question with API key:', API_KEY.substring(0, 8) + '...');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let diversityInstruction = '';
    if (questionIndex !== undefined) {
      diversityInstruction = `This is question #${questionIndex + 1} in a multi-question test. `;
      if (questionIndex > 0) {
        diversityInstruction += 'Please choose a DIFFERENT subject than previous questions to ensure diversity. ';
      }
    }

    const prompt = `Generate a ${difficulty} level question about ${topic}. 
                    
                    IMPORTANT INSTRUCTIONS:
                    ${diversityInstruction}
                    1. If the topic contains multiple subjects (e.g., "Math and Science", "History, Geography, and Literature", etc.), 
                       identify all the subjects and choose one randomly for this question to ensure a diverse mix of questions.
                    2. Make sure the question is detailed, clear, and appropriate for the ${difficulty} difficulty level.
                    
                    Format the response as a VALID JSON object with the following structure:
                    {
                      "question": "the question text",
                      "options": ["option1", "option2", "option3", "option4"],
                      "correctAnswer": "correct option",
                      "explanation": "explanation of the answer"
                    }
                    
                    IMPORTANT: Return ONLY the JSON object, without any markdown code blocks or extra text.
                    Do not include \`\`\`json or \`\`\` markers in your response.`;

    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error('No response received from Gemini API');
    }

    const text = result.response.text();
    console.log('Raw response from Gemini API:', text.substring(0, 100) + '...');
    
    try {
      // Handle responses wrapped in code blocks
      let jsonText = text;
      
      // Check for markdown code blocks and extract the content
      if (text.includes('```')) {
        // Extract content between code blocks
        const codeBlockMatch = text.match(/```(?:json)?([\s\S]+?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          jsonText = codeBlockMatch[1].trim();
        } else {
          // If regex fails, try simple replacement
          jsonText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        }
      }
      
      // Find and extract JSON even if it's not properly formatted with code blocks
      if (!jsonText.startsWith('{')) {
        const jsonStart = jsonText.indexOf('{');
        if (jsonStart !== -1) {
          jsonText = jsonText.substring(jsonStart);
        }
      }
      
      if (!jsonText.endsWith('}')) {
        const jsonEnd = jsonText.lastIndexOf('}');
        if (jsonEnd !== -1) {
          jsonText = jsonText.substring(0, jsonEnd + 1);
        }
      }
      
      console.log('Extracted JSON:', jsonText.substring(0, 100) + '...');
      
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error: any) {
    console.error('Detailed error:', error);
    
    if (error.message?.includes('unregistered callers')) {
      throw new Error('API key authentication failed. Please check if your API key is valid and has proper permissions.');
    }
    
    throw new Error(`Question generation failed: ${error.message}`);
  }
}
