import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import * as fromActions from './wordle.actions';
import { GameService } from '../../services/game/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Board } from '@models/board';
import { StorageService } from '../../services/storage/storage.service';
import { StorageKey } from '@models/storage';

/**
 * WordleEffects
 */
@Injectable()
export class WordleEffects implements OnInitEffects {
  // #region hydrate
  public hydrate$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.hydrate),
    switchMap(() => this.gameService.getWordle()),
    map((wordle) => {
      const canReset = this.storageService.checkLastSaved(wordle.solution);
      if (canReset) {
        this.storageService.resetBoard(StorageKey.BoardState);
      }
      const gameBoard = this.storageService.getStorage<Board>(StorageKey.BoardState);
      return fromActions.hydrateSuccess({ gameBoard, wordle });
    }),
    catchError(() => {
      const error = 'Failure';
      return of(fromActions.hydrateFailure({ error }));
    })
  ));

  // #region enterWord
  public enterWord$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.enterWord),
    map(({ word, solution, boardState }) => {
      if (!this.gameService.isInWordeList(word)) {
        return fromActions.rowNotGuessed({ error: `Le mot n'est pas dans la liste` });
      }
      const boardChecked = this.gameService.checkWord(boardState, solution);
      if (boardChecked.gameStatus !== 'IN_PROGRESS') {
        this.storageService.updateStat(boardChecked.gameStatus, boardChecked.rowIndex + 1);
      }
      return fromActions.enterWordSuccess({ boardState: boardChecked });
    }),
    catchError(() => {
      const error = 'Failure Choose letter';
      return of(fromActions.enterWordFailure({ error }));
    })
  ));

  // #region rowNotGuessed
  public rowNotGuessed$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.rowNotGuessed),
    map(({ error }) =>
      this.matSnackBar.open(error, '', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' })),
    debounceTime(200),
    map(() => fromActions.rowNotGuessedSuccess())
  ));

  // #region getNewWord
  public getNewWord$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.getNewWord),
    map(() => {
      this.storageService.resetBoard(StorageKey.BoardState);
      return fromActions.hydrate();
    }),
  ));

  constructor(
    private actions$: Actions,
    private gameService: GameService,
    private storageService: StorageService,
    private matSnackBar: MatSnackBar,
  ) { }

  public ngrxOnInitEffects(): Action {
    return fromActions.hydrate();
  }
}
