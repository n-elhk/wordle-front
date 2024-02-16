import { Directive, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SquareAttempt } from '@models/board';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { StorageService } from '@services/storage/storage.service';

import {
  selectEvaluations,
  selectGameStatus,
  selectRowIndex,
  selectSolution,
  wordleActions,
} from '@store/wordle';
import { combineLatest, interval, map, Observable } from 'rxjs';
import { AwesomeTooltipDirective } from './tooltip.directive';

@Directive({
  standalone: true,
})
export class ShareDirective {
  /** Injection of {@link Store}. */
  private readonly store = inject(Store);

  /** Injection of {@link StorageService}. */
  private readonly storageService = inject(StorageService);

  readonly tooltip = viewChild.required(AwesomeTooltipDirective);

  private readonly timestamp = signal(
    this.storageService.getStorage<number>(StorageKey.Date)
  );

  readonly url = toSignal(this.getLink(), { initialValue: '' });

  readonly countdown = toSignal(this.countdown$());

  readonly solution = this.store.selectSignal(selectSolution);

  readonly status = this.store.selectSignal(selectGameStatus);

  public clipBord(): void {
    this.tooltip().show();
    setTimeout(() => this.tooltip().hide(), 500);
  }

  private getLink() {
    return combineLatest([
      this.store.select(selectEvaluations),
      this.store.select(selectRowIndex),
    ]).pipe(
      map(([evaluations, rowIndex]) => {
        let tweetText = `wordle (@wordle) ${rowIndex}/${evaluations.length} \n`;

        for (let index = 0; index < rowIndex + 1; index++) {
          const attempts = evaluations[index];
          attempts.forEach(attempt => {
            tweetText = tweetText + SquareAttempt[attempt];
          });
          tweetText = tweetText + `\n`;
        }
        return `https://twitter.com/intent/tweet?text=${tweetText}&related=tusmo_xyz,neurosis_44`;
      })
    );
  }

  private countdownToDate(timestamp: number) {
    // Obtenir la date actuelle
    const now = new Date();

    // Ajouter 1 jour à la date donnée
    const endDate = new Date(timestamp);
    endDate.setDate(endDate.getDate() + 1);

    // Calculer la différence entre les deux dates en millisecondes
    const difference = endDate.getTime() - now.getTime();

    // Convertir la différence en heures, minutes et secondes
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Afficher le décompte
    return { hours, minutes, seconds };
  }

  private countdown$(): Observable<string> {
    return interval(1000).pipe(
      map(() => {
        const timestamp = this.timestamp();
        const { hours, minutes, seconds } = this.countdownToDate(timestamp);

        if (hours + minutes + seconds === 1) {
          this.store.dispatch(wordleActions.hydrate());
        }

        return `${this.zeroPad(hours)}:${this.zeroPad(minutes)}:${this.zeroPad(
          seconds
        )}`;
      })
    );
  }

  public zeroPad(num: number, places = 2): string {
    return String(num).padStart(places, '0');
  }
}
