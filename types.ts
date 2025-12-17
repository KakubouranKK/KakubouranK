
export interface Question {
  id: number;
  text: string;
  category: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export type ViewType = 'INTRO' | 'CHAPTER_COVER' | 'QUESTIONS' | 'RESULTS';

export interface AppState {
  currentView: ViewType;
  currentChapterIndex: number;
  currentPageInChapter: number;
  answers: Record<number, number>; // questionId -> score (-3 to 3)
}
