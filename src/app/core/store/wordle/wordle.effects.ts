import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, rootEffectsInit } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

import { Board } from '@models/board';

import { StorageKey } from '@models/storage';
import { wordleActions } from './wordle.actions';
import { StorageService } from '@services/storage/storage.service';
import { GameService } from '@services/game/game.service';
import { ToastService } from '../../toast/toast.service';

/**
 * WordleEffects
 */
@Injectable()
export class WordleEffects {
  /** Injection of {@link Actions}. */
  private actions$ = inject(Actions);

  /** Injection of {@link GameService}. */
  private gameService = inject(GameService);

  /** Injection of {@link StorageService}. */
  private storageService = inject(StorageService);

  /** Injection of {@link ToastService}. */
  private toastService = inject(ToastService);

  // #region hydrate
  public hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wordleActions.hydrate, rootEffectsInit),
      switchMap(() => this.gameService.getWordle()),
      map((solution) => {
        const gameBoard = this.storageService.getStorage<Board>(
          StorageKey.BoardState
        );
        return wordleActions.hydrateSuccess({ gameBoard, solution });
      }),
      catchError(() => {
        return of(wordleActions.hydrateFailure({ error: 'Failure' }));
      })
    )
  );

  // #region enterWord
  public enterWord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wordleActions.enterWord),
      map(({ word, solution, boardState }) => {
        if (!this.gameService.isInWordeList(word)) {
          return wordleActions.rowNotGuessed({
            error: `Le mot n'est pas dans la liste`,
          });
        }
        const boardChecked = this.gameService.checkWord(boardState, solution);
        if (boardChecked.gameStatus !== 'IN_PROGRESS') {
          this.storageService.updateStat(
            boardChecked.gameStatus,
            boardChecked.rowIndex + 1
          );
        }
        return wordleActions.enterWordSuccess({ boardState: boardChecked });
      }),
      catchError(() => {
        const error = 'Failure Choose letter';
        return of(wordleActions.enterWordFailure({ error }));
      })
    )
  );

  // #region rowNotGuessed
  public rowNotGuessed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wordleActions.rowNotGuessed),
      map(({ error }) =>
        this.toastService.show({ data: { text: error, type: 'warning' } })
      ),
      debounceTime(200),
      map(() => wordleActions.rowNotGuessedSuccess())
    )
  );
}
