import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Wordle } from '@models/wordle';
import { Observable, of } from 'rxjs';
import { WordleStatGame } from '@models/statistic';
import { Attempt, Board, KeyOfAttempt } from '@models';
import { CHRISTIAN_WORDS, DICTIONARY_WORDS } from '../../dictionary/dictionary';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private wordDict = new Set(DICTIONARY_WORDS.concat(CHRISTIAN_WORDS));
  private urlServer = environment.urlServer;

  constructor(
    private httpClient: HttpClient,
  ) { }

  // public init(): Observable<boolean> {
  //   return this.getWordListFile();
  // }

  public getWordle(): Observable<Wordle> {
    return this.httpClient.get<Wordle>(`${this.urlServer}/word`);
  }

  // public getWordListFile(): Observable<boolean> {
  //   return this.httpClient.get('assets/wordlist.txt', { responseType: 'blob' }).pipe(
  //     map((res) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (reader.result) {
  //           const txt = reader.result.toString().trim();
  //           const texts = txt.replace(/\r\n/g, '\n').split('\n');
  //           this.wordDict = new Set(texts);
  //         }
  //       }
  //       reader.readAsText(res);
  //       return true;
  //     })
  //   );
  // }

  public checkWord(boardState: Board, solution: string): Board {

    const { attempts, evaluations, correctLetters, absentLetters, partialLetters } = { ...boardState };
    let { rowIndex } = { ...boardState };

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
      if (arr[arrName].indexOf(e) === -1) { arr[arrName].push(e); }
    });

    const { status, index } = this.checkGameStatus(rowIndex, attempts[rowIndex], solution);

    return {
      ...boardState, evaluations: newEval, gameStatus: status, rowIndex: index,
      absentLetters: arr.absent, correctLetters: arr.correct, partialLetters: arr.partial
    };
  }

  public checkGameStatus(rowIndex: number, word: string, solution: string) {
    if (word === solution) { return { status: 'WIN', index: rowIndex } as const; }

    else if (rowIndex < 5) {
      return { status: 'IN_PROGRESS', index: rowIndex + 1 } as const;
    }
    else { return { status: 'LOOSE', index: rowIndex } as const; }
  }

  private computeColors(targetWord: string, guess: string): KeyOfAttempt[] {
    const colors = new Array(guess.length).fill('');
    const indicesOfIncorrectLettersInGuess = [];
    const targetLetters = {} as Record<string, number>;

    for (let i = 0; i < guess.length; ++i) {
      let targetLetter = targetWord[i];
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
      let guessLetter = guess[i];

      if (guessLetter in targetLetters && targetLetters[guessLetter] > 0) {
        colors[i] = Attempt.partial;
        targetLetters[guessLetter]--;
      } else {
        colors[i] = Attempt.absent;
      }
    }
    // return colors.join('');
    return colors;
  }

  public checkLastSaved(date: number) {
    const now = new Date();
    const currentDate = new Date(date);
    return (currentDate.getDay() !== now.getDay() ||
      currentDate.getMonth() !== now.getMonth() ||
      currentDate.getFullYear() !== now.getFullYear());
  }
  // function test(targetWord: string, guess: string, expectedOutput: string) {
  //   const actualOutput = computeColors(targetWord, guess);
  //   console.log(
  //     expectedOutput === actualOutput, { targetWord, guess, expectedOutput, actualOutput }
  //   );
  // }

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
    return arr.reduce((res, n) => {
      if (n.won) { res[res.length - 1]++; }
      else { res.push(0); }
      return res;
    }, [0]);
  }


  public bestAttempts(arr: WordleStatGame[]): number[] {
    return arr.reduce((res, n) => {
      res[n.nbAttempts - 1]++;
      return res;
    }, [0, 0, 0, 0, 0, 0] as number[]);
  }

  public currentStreak(arr: WordleStatGame[]): number {
    let won = 0;
    for (const e of arr) {
      if (!e.won) { return won; }
      won += 1;
    }
    return won;
  }

  public percentWin(arr: WordleStatGame[]): number {
    const wonsLength = arr.filter((e) => e.won).length;
    if (!wonsLength) { return wonsLength; }
    return (wonsLength / arr.length) * 100;
  }

}
