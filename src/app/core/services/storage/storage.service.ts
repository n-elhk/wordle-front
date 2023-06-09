import { Injectable } from '@angular/core';
import { getWordleMock } from '@mocks';
import { GameStatus } from '@models/board';
import { WordleStat } from '@models/statistic';
import { StorageKey } from '@models/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public resetStorage(key: StorageKey): void {
    this.setStorage(key, getWordleMock()[key]);
  }

  public removeItem(name: StorageKey): void {
    localStorage.removeItem(name);
    window.location.reload();
  }

  public getStorage<T>(key: StorageKey): T {
    try {
      const ls = localStorage.getItem(key);
      if (ls) {
        return JSON.parse(ls) as T;
      }
      throw new Error(`No storage ${key} founded`);
    } catch (error) {
      this.resetStorage(key);
      return this.getStorage(key);
    }
  }

  public setStorage<T>(key: StorageKey, st: T): void {
    localStorage.setItem(key, JSON.stringify(st));
  }

  public updateStat(res: GameStatus, nbAttempts: number): void {
    const st = this.getStorage<WordleStat>(StorageKey.Stat);
    const won = res === 'WIN';
    const game = { date: Date.now(), won, nbAttempts };
    st.games.push(game);
    this.setStorage(StorageKey.Stat, st);
  }

  public checkLastSaved(): boolean {
    const timestamp = localStorage.getItem(StorageKey.Date);

    if (!timestamp || this.isTodayAtLeastOneDayAhead(Number(timestamp))) {
      return true;
    }

    return false;
  }

  private isTodayAtLeastOneDayAhead(timestamp: number): boolean {
    const date = new Date(timestamp),
      today = new Date(),
      oneDay = 24 * 60 * 60 * 1000; // Nombre de millisecondes dans une journée

    /**
     * Compare les dates avec l'écart d'une journée
     * 3_000 car il y a un petit écart sinon 0
     */
    if (date.getTime() + oneDay - today.getTime() < 3_000) {
      return true;
    }

    return false;
  }
}
