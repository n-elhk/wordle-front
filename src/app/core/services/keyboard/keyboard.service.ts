import { inject, Injectable } from '@angular/core';
import { LETTERS } from '@mocks';
import { KeyType } from '@models';
import { Store } from '@ngrx/store';
import { chooseLetter, deleteLetter, enterWord, selectEnterWord } from '@store/wordle';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  private store = inject(Store);

  async enterLetter(letter: string): Promise<void> {
    const { boardState, currentBoard, solution } = await firstValueFrom(this.store.select(selectEnterWord()));
    const { gameStatus } = boardState;
    if (gameStatus === 'IN_PROGRESS') {
      const key = letter.toUpperCase();
      if (key.match('BACKSPACE|DELETE|ESCAPE')) { this.store.dispatch(deleteLetter()); }
      if (currentBoard.length < solution.length) {
        if (LETTERS.indexOf(key) > -1) { this.store.dispatch(chooseLetter({ letter })); }
      }
      if (KeyType.ENTER === key && currentBoard.length === solution.length) {
        this.store.dispatch(enterWord({ word: currentBoard, boardState, solution }));
      }
    }
  }

}
