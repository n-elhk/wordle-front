import { Wordle } from '@models/wordle';
import { createAction, props } from '@ngrx/store';
import { Board } from '../../models/board';
import { WordleActionTypes } from './worldle.types';

export const hydrate = createAction(WordleActionTypes.Hydrate);
export const hydrateFailure = createAction(WordleActionTypes.HydrateFailure, props<{ error: string }>());
export const hydrateSuccess = createAction(WordleActionTypes.HydrateSuccess, props<{ gameBoard: Board, wordle: Wordle }>());

export const getWord = createAction(WordleActionTypes.GetWord);
export const getWordFailure = createAction(WordleActionTypes.GetWordFailure, props<{ error: string }>());
export const getWordSuccess = createAction(WordleActionTypes.GetWordSuccess, props<{ word: string }>());


export const chooseLetter = createAction(WordleActionTypes.ChooseLetter, props<{ letter: string }>());
export const chooseLetterFailure = createAction(WordleActionTypes.ChooseLetterFailure, props<{ error: string }>());
export const chooseLetterSuccess = createAction(WordleActionTypes.ChooseLetterSuccess, props<{ attempts: string[] }>());

export const deleteLetter = createAction(WordleActionTypes.DeleteLetter);
export const deleteLetterFailure = createAction(WordleActionTypes.DeleteLetterFailure, props<{ error: string }>());
export const deleteLetterSuccess = createAction(WordleActionTypes.DeleteLetterSuccess, props<{ attempts: string[] }>());

export const enterWord = createAction(WordleActionTypes.EnterWord, props<{ word: string, boardState: Board, solution: string }>());
export const enterWordFailure = createAction(WordleActionTypes.EnterWordFailure, props<{ error: string }>());
export const enterWordSuccess = createAction(WordleActionTypes.EnterWordSuccess, props<{ boardState: Board }>());

export const rowNotGuessed = createAction(WordleActionTypes.RowNotGuessed, props<{ error: string }>());
export const rowNotGuessedSuccess = createAction(WordleActionTypes.RowNotGuessedSuccess);

export const getNewWord = createAction(WordleActionTypes.GetNewWord);

