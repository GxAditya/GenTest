# QuestionBuilder

A modern quiz/test generator application that uses Gemini AI to create educational questions on any subject.

## Features

- Generate up to 10 questions on any subject or combination of subjects
- Support for mixed-subject tests (e.g., "Math, Science, and History")
- Customizable number of questions
- Multiple-choice format with explanations
- Modern, responsive UI with beautiful animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- shadcn-ui components
- TailwindCSS for styling
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js with Express
- Google Gemini AI API for question generation
- TypeScript for type safety

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd questionbuilder-main
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

4. Set up environment variables
   - Create a `.env` file in the root directory for frontend variables
   - Create a `.env` file in the `backend` directory for backend variables
   - Add your Gemini API key to both files:

Root `.env` file:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

Backend `.env` file:
```
PORT=3000
GEMINI_API_KEY=your_api_key_here
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend application
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a subject or multiple subjects separated by commas or "and" (e.g., "Math, Science, and History")
2. Use the slider to select the number of questions (1-10)
3. Click "Generate Test" to create your quiz
4. Review the generated questions and use them for your educational needs

## Project Structure

- `/src` - Frontend React application
- `/backend` - Express backend server
- `/public` - Static assets

## License

MIT

## Acknowledgements

- Google Gemini AI for powering the question generation
- shadcn/ui for the beautiful component library
- The open-source community for all the amazing tools that made this project possible
