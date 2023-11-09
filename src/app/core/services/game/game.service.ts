import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WordleStatGame } from '@models/statistic';
import { Attempt, Board, KeyOfAttempt } from '@models';
import { CHRISTIAN_WORDS, DICTIONARY_WORDS } from '../../dictionary/dictionary';
import { StorageService } from '@services/storage/storage.service';
import { StorageKey } from '@models/storage';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  /** Injection of {@link StorageService}. */
  private storageService = inject(StorageService);

  private wordDict = new Set(DICTIONARY_WORDS.concat(CHRISTIAN_WORDS));

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @description Server is down, play localy
   * @returns Wordle object
   */
  public getWordle(): Observable<string> {
    if (this.storageService.checkLastSaved()) {
      const words = CHRISTIAN_WORDS.filter(w => w.length < 9);

      const random = this.getRandomNumber(0, words.length - 1);

      const word = words[random];

      const b64 = window.btoa(word);
      this.storageService.setStorage(StorageKey.Answer, b64);
      this.storageService.setStorage(StorageKey.Date, new Date().getTime());
      this.storageService.resetStorage(StorageKey.BoardState);

      return of(b64);
    }

    return of(this.storageService.getStorage<string>(StorageKey.Answer));
  }

  public checkWord(boardState: Board, solution: string): Board {
    const {
      attempts,
      evaluations,
      correctLetters,
      absentLetters,
      partialLetters,
    } = { ...boardState };
    const { rowIndex } = { ...boardState };

    const word = attempts[rowIndex];
    const newEval = [...evaluations];

    const arr = {
      correct: ([] as string[]).concat(correctLetters),
      absent: ([] as string[]).concat(absentLetters),
      partial: ([] as string[]).concat(partialLetters),
    };

    newEval[rowIndex] = [...this.computeColors(solution, word)];

    Array.from(word).forEach((e, i) => {
      const arrName = newEval[rowIndex][i];
      if (arr[arrName].indexOf(e) === -1) {
        arr[arrName].push(e);
      }
    });

    const { status, index } = this.checkGameStatus(
      rowIndex,
      attempts[rowIndex],
      solution
    );

    return {
      ...boardState,
      evaluations: newEval,
      gameStatus: status,
      rowIndex: index,
      absentLetters: arr.absent,
      correctLetters: arr.correct,
      partialLetters: arr.partial,
    };
  }

  public checkGameStatus(rowIndex: number, word: string, solution: string) {
    if (word === solution) {
      return { status: 'WIN', index: rowIndex } as const;
    } else if (rowIndex < 5) {
      return { status: 'IN_PROGRESS', index: rowIndex + 1 } as const;
    } else {
      return { status: 'LOOSE', index: rowIndex } as const;
    }
  }

  private computeColors(targetWord: string, guess: string): KeyOfAttempt[] {
    const colors = new Array(guess.length).fill('');
    const indicesOfIncorrectLettersInGuess = [];
    const targetLetters = {} as Record<string, number>;

    for (let i = 0; i < guess.length; ++i) {
      const targetLetter = targetWord[i];
      if (targetLetter in targetLetters) {
        targetLetters[targetLetter]++;
      } else {
        targetLetters[targetLetter] = 1;
      }

      if (guess[i] === targetLetter) {
        colors[i] = Attempt.correct;
        targetLetters[targetLetter]--;
      } else {
        indicesOfIncorrectLettersInGuess.push(i);
      }
    }

    for (const i of indicesOfIncorrectLettersInGuess) {
      const guessLetter = guess[i];

      if (guessLetter in targetLetters && targetLetters[guessLetter] > 0) {
        colors[i] = Attempt.partial;
        targetLetters[guessLetter]--;
      } else {
        colors[i] = Attempt.absent;
      }
    }
    return colors;
  }

  public checkLastSaved(date: number) {
    const now = new Date();
    const currentDate = new Date(date);
    return (
      currentDate.getDay() !== now.getDay() ||
      currentDate.getMonth() !== now.getMonth() ||
      currentDate.getFullYear() !== now.getFullYear()
    );
  }

  public isInWordeList(word: string): boolean {
    return this.wordDict.has(word);
  }

  public getStat(arr: WordleStatGame[]) {
    return {
      bestStreak: this.bestStreak(arr)[0],
      currentStreak: this.currentStreak(arr),
      percentWin: this.percentWin(arr),
      bestAttempts: this.bestAttempts(arr),
    };
  }

  public bestStreak(arr: WordleStatGame[]): number[] {
    return arr.reduce(
      (res, n) => {
        if (n.won) {
          res[res.length - 1]++;
        } else {
          res.push(0);
        }
        return res;
      },
      [0]
    );
  }

  public bestAttempts(arr: WordleStatGame[]): number[] {
    return arr.reduce(
      (acc, curr) => {
        const nbAttempts =
          curr.nbAttempts === 6 && curr.won
            ? curr.nbAttempts - 1
            : curr.nbAttempts;
        acc[nbAttempts]++;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0] as number[]
    );
  }

  public currentStreak(arr: WordleStatGame[]): number {
    let won = 0;
    for (const e of arr) {
      if (!e.won) {
        return won;
      }
      won += 1;
    }
    return won;
  }

  public percentWin(arr: WordleStatGame[]): number {
    const wonsLength = arr.filter(e => e.won).length;
    if (!wonsLength) {
      return wonsLength;
    }
    return (wonsLength / arr.length) * 100;
  }
}
