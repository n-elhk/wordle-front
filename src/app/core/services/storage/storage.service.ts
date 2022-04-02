import { Injectable } from '@angular/core';
import { getWordleMock } from '@mocks';
import { Board, GameStatus } from '@models/board';
import { WordleStat } from '@models/statistic';
import { StorageKey } from '@models/storage';
import { Observable, map } from 'rxjs';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private gameService: GameService
  ) { }

  public resetBoard(key: StorageKey): void {
    console.log(key);
    this.setStorage(key, getWordleMock()[key]);
  }

  public removeItem(name: StorageKey): void {
    localStorage.removeItem(name);
    window.location.reload();
  }

  public create(): Observable<boolean> {
    this.getStorage<Board>(StorageKey.BoardState);
    return this.gameService.init().pipe(map(() => true));
  }

  public getStorage<T>(key: StorageKey): T {
    try {
      const ls = localStorage.getItem(key);
      console.log(ls);
      if (ls) { return (JSON.parse(ls)) as T; }
      throw new Error(`No storage ${key} founded`);
    } catch (error) {
      console.log(error);
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


}
