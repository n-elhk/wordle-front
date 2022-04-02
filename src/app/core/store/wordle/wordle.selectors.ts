import { Board, GameStatus, KeyOfAttempt } from '@models/board';
import { Wordle } from '@models/wordle';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName } from './wordle.reducer';
import { IBoardState } from './wordle.state';

export const selectParameters = createFeatureSelector<IBoardState>(featureName);

export const selectBoardState = () => createSelector(
  selectParameters, (state): Board => state.boardState,
);

export const selectWordle = () => createSelector(
  selectParameters, (state): Wordle => state.wordle,
);

export const selectBoardLoading = () => createSelector(
  selectParameters, (state): boolean => state.loading,
);

export const selectAttemptsState = () => createSelector(
  selectParameters, ({ boardState }): string[] => boardState.attempts,
);

export const selectGameStatus = () => createSelector(
  selectParameters, ({ boardState }): GameStatus => boardState.gameStatus,
);

export const selectRowIndex = () => createSelector(
  selectParameters, ({ boardState }): number => boardState.rowIndex,
);

export const selectCurrentBoard = () => createSelector(
  selectParameters, ({ boardState }): string => boardState.attempts[boardState.rowIndex],
);

export const selectSolution = () => createSelector(
  selectParameters, (state): string => state.wordle.solution,
);


export const selectEvaluations = () => createSelector(
  selectParameters, ({ boardState }): KeyOfAttempt[][] => boardState.evaluations,
);

export const selectDateMode = () => createSelector(
  selectParameters, (state): number => state.dateMode,
);

export const selectEnterWord = () => createSelector(
  selectParameters, ({ boardState, wordle, dateMode }) =>
  ({ boardState: boardState, currentBoard: boardState.attempts[boardState.rowIndex], solution: wordle.solution, dateMode  }),
);


export const selectLettersChoosed = () => createSelector(
  selectParameters, ({ boardState }): [string[], string[], string[]] => [boardState.partialLetters, boardState.correctLetters, boardState.absentLetters],
);
