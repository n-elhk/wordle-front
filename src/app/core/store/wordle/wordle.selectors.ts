import { createSelector } from '@ngrx/store';
import { wordleFeature } from './wordle.reducer';

export const { 
  selectBoardState,
  selectWordle,
  selectLoading,
 } = wordleFeature;

export const selectAttemptsState = createSelector(
  selectBoardState, ({ attempts }) => attempts,
);

export const selectGameStatus = createSelector(
  selectBoardState, ({ gameStatus }) => gameStatus,
);

export const selectRowIndex = createSelector(
  selectBoardState, ({ rowIndex }) => rowIndex,
);

export const selectCurrentBoard = createSelector(
  selectAttemptsState, selectRowIndex, (attempts, rowIndex) => attempts[rowIndex],
);

export const selectSolution = createSelector(
  selectWordle, (wordle) => wordle.solution,
);

export const selectEvaluations = createSelector(
  selectBoardState, ({ evaluations }) => evaluations,
);

export const selectEnterWord = createSelector(
  selectBoardState, selectCurrentBoard, selectSolution, (boardState, currentBoard, solution) =>
  ({ boardState, currentBoard, solution  }),
);

export const selectLettersChoosed = createSelector(
  selectBoardState, ({partialLetters, correctLetters, absentLetters}): [string[], string[], string[]] => [partialLetters, correctLetters, absentLetters],
);
