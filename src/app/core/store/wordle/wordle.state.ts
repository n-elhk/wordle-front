import { Board } from '@models/board';

export interface IBoardState {
  boardState: Board,
  solution: string,
  rowError: string,
  loading: boolean;
  loaded: boolean;
  error: string;
}
