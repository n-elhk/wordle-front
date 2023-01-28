import { BOARD } from '@mocks';
import { KeyOfAttempt } from '@models/board';
import { Wordle } from '@models/wordle';
import { createFeature, createReducer, on } from '@ngrx/store';
import { featureName } from './feature.name';
import { wordleActions } from './wordle.actions';

import { IBoardState } from './wordle.state';

export const initialState: IBoardState = {
  boardState: { ...BOARD },
  wordle: {} as Wordle,
  rowError: '',
  loading: false,
  loaded: false,
  error: '',
};

export const wordleFeature = createFeature({
  name: featureName,
  reducer: createReducer(
    initialState,
    on(wordleActions.hydrate, state => ({ ...state, loading: true, loaded: false, error: '' })),
    on(wordleActions.hydrateFailure, (state, { error }) => ({ ...state, loading: false, error })),
    on(wordleActions.hydrateSuccess, (state, { gameBoard, wordle }) => {
      let evaluations: KeyOfAttempt[][] = [];
      
      const solution = window.atob(wordle.solution),
       link = window.atob(wordle.link);
  
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
  
    on(wordleActions.getWord, state => ({ ...state, loading: true, loaded: false, error: '' })),
    on(wordleActions.getWordFailure, (state, { error }) => ({ ...state, loading: false, error })),
    on(wordleActions.getWordSuccess, (state, { word }) => {
      return ({ ...state, loading: false, loaded: true, word, error: '' });
    }),
  
    on(wordleActions.chooseLetter, (state, { letter }) => {
      const { attempts, rowIndex } = { ...state.boardState };
      const newBoard = [...attempts];
      newBoard[rowIndex] = newBoard[rowIndex] + letter;
      return { ...state, boardState: { ...state.boardState, attempts: newBoard } };
    }),
  
    on(wordleActions.deleteLetter, (state) => {
      const { attempts, rowIndex } = { ...state.boardState };
      const newBoard = [...attempts];
      newBoard[rowIndex] = newBoard[rowIndex].slice(0, -1);
      return { ...state, boardState: { ...state.boardState, attempts: newBoard } };
    }),
  
    on(wordleActions.enterWordSuccess, (state, { boardState }) => {
      return { ...state, boardState };
    }),
  ),
})


