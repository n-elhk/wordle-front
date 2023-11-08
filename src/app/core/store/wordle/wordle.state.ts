import { Board } from '@models/board';

export type IBoardState = {
  boardState: Board;
  solution: string;
  rowError: string;
  status: RequestStatus;
  error: string;
};

export enum RequestStatus {
  INITIAL = 'initial',
  LOADED = 'loaded',
  LOADING = 'loading',
  ERROR = 'error',
}
