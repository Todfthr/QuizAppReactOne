import axios from 'axios';
import type { ExternalQuizResponse } from '../types/quiz.types';

const EXTERNAL_API_URL = 'http://192.168.1.12:8000';
// const EXTERNAL_API_URL = 'https://sailing-sin-deposits-basement.trycloudflare.com';


const externalApiClient = axios.create({
  baseURL: EXTERNAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// export const externalQuizApi = {
//   generateQuiz: async (query: string): Promise<ExternalQuizResponse> => {
//     const response = await externalApiClient.post<ExternalQuizResponse>('', {
//       query
//     });
//     return response.data;
//   },
// };

export const externalQuizApi = {
  generateQuiz: async (query: string): Promise<ExternalQuizResponse> => {
    const response = await externalApiClient.post<ExternalQuizResponse>(
      '/api/generate-quiz',
      { query }
    );
    return response.data;
  },
};