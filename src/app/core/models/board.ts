export interface Board {
  attempts: string[];
  evaluations: KeyOfAttempt[][];
  gameStatus: GameStatus;
  correctLetters: string[];
  lastSave: number;
  absentLetters: string[];
  partialLetters: string[];
  rowIndex: number;
}

export type GameStatus = 'IN_PROGRESS' | 'WIN' | 'LOOSE';

export enum Attempt {
  correct = 'correct',
  partial = 'partial',
  absent = 'absent',
}

export type KeyOfAttempt = keyof typeof Attempt;

export enum SquareAttempt {
  correct = '🟩',
  partial = '🟧',
  absent = '🟥',
}
