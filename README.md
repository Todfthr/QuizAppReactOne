# QuizMaster - React Quiz Application

A fully functional Quiz App built with React, Vite, TypeScript, Bootstrap, React Router 6, TanStack React Query, and React Hook Form. Uses MockAPI for backend simulation.

## Features

- Browse available quizzes
- Take quizzes with instant scoring
- View quiz results and history
- Create new quizzes
- Responsive design with Bootstrap

## Tech Stack

- **React** - Frontend library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Bootstrap 5** - UI framework
- **React Router 6** - Routing
- **TanStack React Query** - Server state management
- **React Hook Form** - Form validation
- **MockAPI** - Backend simulation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd quiz-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Setting up MockAPI

1. Visit [MockAPI.io](https://mockapi.io/) and create an account
2. Create a new project
3. Create two resources:
   - `quizzes` - for storing quiz data
   - `results` - for storing quiz results

4. For the `quizzes` resource, add the following schema:
   ```json
   {
     "id": "string",
     "title": "string",
     "description": "string",
     "duration": "number",
     "questions": [
       {
         "id": "string",
         "text": "string",
         "options": ["string"],
         "correctAnswer": "number"
       }
     ]
   }
   ```

5. For the `results` resource, add the following schema:
   ```json
   {
     "id": "string",
     "quizId": "string",
     "userId": "string",
     "answers": [
       {
         "questionId": "string",
         "selectedOption": "number"
       }
     ],
     "score": "number",
     "totalQuestions": "number",
     "completedAt": "string"
   }
   ```

6. Update the API endpoint in `src/api/quiz.api.ts` with your MockAPI project URL

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript types
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

To deploy the application:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting platform (Netlify, Vercel, GitHub Pages, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.