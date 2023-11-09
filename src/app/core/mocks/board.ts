import { Board } from '@models/board';
import { StorageKey } from '@models/storage';

export const BOARD: Board = {
  attempts: ['', '', '', '', '', ''], // night 1
  evaluations: [], //,['absent', 'absent', 'absent', 'absent', 'absent']
  gameStatus: 'IN_PROGRESS',
  partialLetters: [],
  absentLetters: [],
  correctLetters: [],
  lastSave: Date.now(),
  rowIndex: 0,
};

export const getWordleMock = () => ({
  [StorageKey.BoardState]: {
    attempts: ['', '', '', '', '', ''], // night 1
    evaluations: [], //,['absent', 'absent', 'absent', 'absent', 'absent']
    gameStatus: 'IN_PROGRESS',
    partialLetters: [],
    absentLetters: [],
    correctLetters: [],
    lastSave: Date.now(),
    rowIndex: 0,
  },
  [StorageKey.Stat]: { games: [] },
  [StorageKey.Answer]: '',
  [StorageKey.Date]: new Date().getTime(),
});
