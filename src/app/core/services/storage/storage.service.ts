import { Injectable } from '@angular/core';
import { getWordleMock } from '@mocks';
import { GameStatus } from '@models/board';
import { WordleStat } from '@models/statistic';
import { StorageKey } from '@models/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public resetBoard(key: StorageKey): void {
    this.setStorage(key, getWordleMock()[key]);
  }

  public removeItem(name: StorageKey): void {
    localStorage.removeItem(name);
    window.location.reload();
  }

  // public create(): Observable<boolean> {
  //   // this.getStorage<Board>(StorageKey.BoardState);
  //   return this.gameService.init().pipe(map(() => true));
  // }

  public getStorage<T>(key: StorageKey): T {
    try {
      const ls = localStorage.getItem(key);
      if (ls) { return (JSON.parse(ls)) as T; }
      throw new Error(`No storage ${key} founded`);
    } catch (error) {
      this.resetBoard(key);
      return this.getStorage(key);
    }
  }

  public setStorage<T>(key: StorageKey, st: T): void {
    localStorage.setItem(key, JSON.stringify(st));
  }

  updateStat(res: GameStatus, nbAttempts: number) {
    const st = this.getStorage<WordleStat>(StorageKey.Stat);
    const won = res === 'WIN';
    const game = { date: Date.now(), won, nbAttempts };
    st.games.push(game);
    this.setStorage(StorageKey.Stat, st);
  }

  checkLastSaved(solution: string) {
    const currentSolution = this.getStorage<string>(StorageKey.Answer);
    if (currentSolution !== solution) {
      this.setStorage(StorageKey.Answer, solution);
      return true;
    }
    return false;
  }


}
