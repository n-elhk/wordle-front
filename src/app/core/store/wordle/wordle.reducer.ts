import { BOARD } from '@mocks';
import { KeyOfAttempt } from '@models/board';
import { Wordle } from '@models/wordle';
import { createReducer, on } from '@ngrx/store';

import * as WordleActions from './wordle.actions';
import { IBoardState } from './wordle.state';

export const featureName = 'Wordle';
const { gameStatus } = { ...BOARD, }
export const initialState: IBoardState = {
  boardState: { ...BOARD },
  wordle: {} as Wordle,
  rowError: '',
  loading: false,
  loaded: false,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(WordleActions.hydrate, state => ({ ...state, loading: true, loaded: false, error: '' })),
  on(WordleActions.hydrateFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(WordleActions.hydrateSuccess, (state, { gameBoard, wordle }) => {

    const solution = atob(wordle.solution);
    const link = atob(wordle.link);
    let evaluations: KeyOfAttempt[][] = [];

    if (gameBoard.evaluations.length === 0) {
      const l = new Array(solution.length).fill('');
      evaluations = new Array(6).fill(l);
    }
    else { evaluations = gameBoard.evaluations; }

    return {
      ...state,
      boardState: { ...gameBoard, evaluations },
      wordle: { ...wordle, solution, link },
      loading: false, loaded: true, error: '',
    }
  }),

  on(WordleActions.getWord, state => ({ ...state, loading: true, loaded: false, error: '' })),
  on(WordleActions.getWordFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(WordleActions.getWordSuccess, (state, { word }) => {
    return ({ ...state, loading: false, loaded: true, word, error: '' });
  }),

  on(WordleActions.chooseLetter, (state, { letter }) => {
    const { attempts, rowIndex } = { ...state.boardState };
    const newBoard = [...attempts];
    newBoard[rowIndex] = newBoard[rowIndex] + letter;
    return { ...state, boardState: { ...state.boardState, attempts: newBoard } };
  }),

  on(WordleActions.deleteLetter, (state) => {
    const { attempts, rowIndex } = { ...state.boardState };
    const newBoard = [...attempts];
    newBoard[rowIndex] = newBoard[rowIndex].slice(0, -1);
    return { ...state, boardState: { ...state.boardState, attempts: newBoard } };
  }),

  on(WordleActions.enterWordSuccess, (state, { boardState }) => {
    return { ...state, boardState };
  }),
);

