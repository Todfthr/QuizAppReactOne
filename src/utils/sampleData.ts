// Sample quiz data for testing purposes
export const sampleQuizzes = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    duration: 10,
    questions: [
      {
        id: 'q1',
        text: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 3
      },
      {
        id: 'q2',
        text: 'What does the "DOM" stand for?',
        options: [
          'Document Object Model',
          'Data Object Management',
          'Dynamic Object Model',
          'Document Oriented Model'
        ],
        correctAnswer: 0
      },
      {
        id: 'q3',
        text: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Check your understanding of React core concepts',
    duration: 15,
    questions: [
      {
        id: 'q4',
        text: 'What is JSX?',
        options: [
          'A JavaScript extension syntax',
          'A JavaScript library',
          'A CSS framework',
          'A testing tool'
        ],
        correctAnswer: 0
      },
      {
        id: 'q5',
        text: 'Which hook is used to manage state in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1
      },
      {
        id: 'q6',
        text: 'What is the purpose of keys in React lists?',
        options: [
          'To style list items',
          'To identify elements uniquely for React',
          'To sort list items',
          'To animate list items'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export const sampleResults = [
  {
    id: 'r1',
    quizId: '1',
    userId: 'user1',
    answers: [
      { questionId: 'q1', selectedOption: 3 },
      { questionId: 'q2', selectedOption: 0 },
      { questionId: 'q3', selectedOption: 0 }
    ],
    score: 3,
    totalQuestions: 3,
    completedAt: '2025-12-01T10:30:00Z'
  },
  {
    id: 'r2',
    quizId: '2',
    userId: 'user1',
    answers: [
      { questionId: 'q4', selectedOption: 0 },
      { questionId: 'q5', selectedOption: 1 },
      { questionId: 'q6', selectedOption: 2 }
    ],
    score: 2,
    totalQuestions: 3,
    completedAt: '2025-12-02T14:45:00Z'
  }
];