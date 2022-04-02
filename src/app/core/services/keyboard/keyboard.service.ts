import { Injectable } from '@angular/core';
import { LETTERS } from '@mocks';
import { KeyType } from '@models';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs';
import { AppState } from '../../store/core.reducer';
import { deleteLetter, chooseLetter, enterWord, selectEnterWord } from '../../store/wordle';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor(
    private store: Store<AppState>,
  ) { }

  enterLetter(letter: string) {
    return this.store.select(selectEnterWord()).pipe(
      take(1),
      tap(({ boardState, currentBoard, solution, dateMode }) => {
        const { gameStatus } = boardState;
        if (gameStatus === 'IN_PROGRESS') {
          const key = letter.toUpperCase();
          if (key.match('BACKSPACE|DELETE|ESCAPE')) { this.store.dispatch(deleteLetter()); }
          if (currentBoard.length < solution.length) {
            if (LETTERS.indexOf(key) > -1) { this.store.dispatch(chooseLetter({ letter })); }
          }
          if (KeyType.ENTER === key && currentBoard.length === solution.length) {
            this.store.dispatch(enterWord({ word: currentBoard, boardState, solution, dateMode }));
          }
        }
      })
    );
  }

}
