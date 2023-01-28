import { Board } from '@models/board';
import { Wordle } from '@models/wordle';

export interface IBoardState {
  boardState: Board,
  wordle: Wordle,
  rowError: string,
  loading: boolean;
  loaded: boolean;
  error: string;
}
