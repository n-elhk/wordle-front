import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
import {
  combineLatest,
  interval,
  map,
  merge,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

@Directive({
  standalone: true,
})
export class ShareDirective implements OnInit, OnDestroy {
  private domSanitizer = inject(DomSanitizer);
  protected store = inject(Store);
  protected storageService = inject(StorageService);

  public destroy$ = new Subject<void>();

  protected tweetText = '';
  protected url = '';
  protected safeUrl!: SafeUrl;

  protected countdown = toSignal(this.countdown$());
  protected status$ = this.store.select(selectGameStatus);
  protected solution$ = this.store.select(selectSolution);

  public ngOnInit(): void {
    merge(this.getLink()).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getLink(): Observable<void> {
    return combineLatest([
      this.store.select(selectEvaluations),
      this.store.select(selectRowIndex),
    ]).pipe(
      map(([evaluations, rowIndex]) => {
        let tweetText = `Christus (@Christus) ${rowIndex}/${evaluations.length} \n`;

        for (let index = 0; index < rowIndex + 1; index++) {
          const attempts = evaluations[index];
          attempts.forEach((attempt) => {
            tweetText = tweetText + SquareAttempt[attempt];
          });
          tweetText = tweetText + `\n`;
        }
        this.url = `https://twitter.com/intent/tweet?text=${tweetText}&related=tusmo_xyz,neurosis_44`;
        this.safeUrl = this.domSanitizer.bypassSecurityTrustUrl(this.url);
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
        const timestamp = this.storageService.getStorage<number>(
          StorageKey.Date
        );
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
