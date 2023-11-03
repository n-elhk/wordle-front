import {
  Injector,
  assertInInjectionContext,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { LETTERS } from '@mocks';
import { KeyType } from '@models';
import { Store } from '@ngrx/store';
import { selectEnterWord, wordleActions } from '@store/wordle';

export const enterLetter = (letter: string, injector?: Injector) => {
  if (!injector) {
    assertInInjectionContext(enterLetter);
  }

  const assertedInjector = injector ?? inject(Injector);

  runInInjectionContext(assertedInjector, () => {
    const store = inject(Store);
    const enterWord = store.selectSignal(selectEnterWord);
    const { boardState, currentBoard, solution } = enterWord();
    const { gameStatus } = boardState;
    if (gameStatus === 'IN_PROGRESS') {
      const key = letter.toUpperCase();
      if (key.match('BACKSPACE|DELETE|ESCAPE')) {
        store.dispatch(wordleActions.deleteLetter());
      }
      if (currentBoard.length < solution.length) {
        if (LETTERS.indexOf(key) > -1) {
          store.dispatch(wordleActions.chooseLetter({ letter }));
        }
      }
      if (KeyType.ENTER === key && currentBoard.length === solution.length) {
        store.dispatch(
          wordleActions.enterWord({ word: currentBoard, boardState, solution })
        );
      }
    }
  });
};
