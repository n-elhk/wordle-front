import { BOARD } from '@mocks';
import { KeyOfAttempt } from '@models/board';
import { createFeature, createReducer, on } from '@ngrx/store';
import { featureName } from './feature.name';
import { wordleActions } from './wordle.actions';

import { IBoardState, RequestStatus } from './wordle.state';

export const initialState: IBoardState = {
  boardState: { ...BOARD },
  solution: '',
  rowError: '',
  status: RequestStatus.INITIAL,
  error: '',
};

export const wordleFeature = createFeature({
  name: featureName,
  reducer: createReducer(
    initialState,
    on(wordleActions.hydrate, (state) => ({
      ...state,
      status: RequestStatus.LOADING,
      error: '',
    })),
    on(wordleActions.hydrateFailure, (state, { error }) => ({
      ...state,
      status: RequestStatus.ERROR,
      error,
    })),
    on(wordleActions.hydrateSuccess, (state, { gameBoard, solution }) => {
      let evaluations: KeyOfAttempt[][] = [];

      const solutionDecrypte = window.atob(solution);
      if (gameBoard.evaluations.length === 0) {
        const l = new Array(solutionDecrypte.length).fill('');
        evaluations = new Array(6).fill(l);
      } else {
        evaluations = gameBoard.evaluations;
      }

      return {
        ...state,
        boardState: { ...gameBoard, evaluations },
        solution: solutionDecrypte,
        status: RequestStatus.LOADED,
        error: '',
      };
    }),

    on(wordleActions.getWord, (state) => ({
      ...state,
      status: RequestStatus.LOADING,
      error: '',
    })),
    on(wordleActions.getWordFailure, (state, { error }) => ({
      ...state,
      status: RequestStatus.ERROR,
      error,
    })),
    on(wordleActions.getWordSuccess, (state, { word }) => {
      return {
        ...state,
        status: RequestStatus.LOADED,
        word,
        error: '',
      };
    }),

    on(wordleActions.chooseLetter, (state, { letter }) => {
      const { attempts, rowIndex } = { ...state.boardState };
      const newBoard = [...attempts];
      newBoard[rowIndex] = newBoard[rowIndex] + letter;
      return {
        ...state,
        boardState: { ...state.boardState, attempts: newBoard },
      };
    }),

    on(wordleActions.deleteLetter, (state) => {
      const { attempts, rowIndex } = { ...state.boardState };
      const newBoard = [...attempts];
      newBoard[rowIndex] = newBoard[rowIndex].slice(0, -1);
      return {
        ...state,
        boardState: { ...state.boardState, attempts: newBoard },
      };
    }),

    on(wordleActions.enterWordSuccess, (state, { boardState }) => {
      return { ...state, boardState };
    })
  ),
});
