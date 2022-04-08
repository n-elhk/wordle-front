import { Board } from '@models/board';
import { Wordle } from '@models/wordle';

/** The brady tachy state on ngrx store. */
export interface IBoardState {
  /** The loading state of get all parameter associated to the current context. */
  boardState: Board,

  wordle: Wordle,
  rowError: string,

  loading: boolean;
  /** The loaded state of get all parameters associated to the current context. */
  loaded: boolean;

  /** Contains the last error occured during program / update or get parameters of the current context. */
  error: string;
}
