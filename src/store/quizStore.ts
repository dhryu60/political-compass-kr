import { create } from 'zustand';
import { QUESTIONS, Question } from '../data/questions';

export interface Demographics {
  gender: string;
  ageGroup: string;
}

export interface QuizState {
  demographics: Demographics | null;
  answers: Record<number, number>; // key: questionId, value: -2 | -1 | 0 | 1 | 2
  currentQuestionIndex: number;
  results: { x: number; y: number } | null;
  
  // Actions
  setDemographics: (gender: string, ageGroup: string) => void;
  saveAnswer: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  calculateScores: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  demographics: null,
  answers: {},
  currentQuestionIndex: 0,
  results: null,

  setDemographics: (gender, ageGroup) => set({
    demographics: { gender, ageGroup },
    answers: {},
    currentQuestionIndex: 0,
    results: null
  }),

  saveAnswer: (questionId, value) => set((state) => ({
    answers: {
      ...state.answers,
      [questionId]: value
    }
  })),

  nextQuestion: () => set((state) => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      return { currentQuestionIndex: state.currentQuestionIndex + 1 };
    }
    return {};
  }),

  prevQuestion: () => set((state) => {
    if (state.currentQuestionIndex > 0) {
      return { currentQuestionIndex: state.currentQuestionIndex - 1 };
    }
    return {};
  }),

  calculateScores: () => {
    const { answers } = get();
    let sumX = 0;
    let sumY = 0;

    QUESTIONS.forEach((q) => {
      const val = answers[q.id] ?? 0; // default to neutral if unanswered
      const score = val * q.direction;
      if (q.axis === 'X') {
        sumX += score;
      } else {
        sumY += score;
      }
    });

    // 15 questions per axis. Max score is 15 * 2 = 30, Min is 15 * -2 = -30.
    // We normalize strictly between -10.0 and +10.0.
    // Formula: normalized = (sum / 30) * 10 = sum / 3.0
    const x = parseFloat((sumX / 3.0).toFixed(2));
    const y = parseFloat((sumY / 3.0).toFixed(2));

    set({ results: { x, y } });
  },

  resetQuiz: () => set({
    demographics: null,
    answers: {},
    currentQuestionIndex: 0,
    results: null
  })
}));
