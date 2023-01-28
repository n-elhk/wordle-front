import { Directive, inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SquareAttempt } from '@models/board';
import { Store } from '@ngrx/store';
import { AppState } from '@store/core.reducer';
import { getNewWord, selectEvaluations, selectGameStatus, selectRowIndex, selectSolution, selectWordle } from '@store/wordle';
import { combineLatest, interval, map, merge, Observable, Subject, takeUntil } from 'rxjs';

@Directive({
  standalone: true,
})
export class ShareDirective implements OnDestroy {
  private domSanitizer = inject(DomSanitizer);
  protected store = inject(Store<AppState>);

  public destroy$ = new Subject<void>();

  protected tweetText = '';
  protected url = '';
  protected safeUrl!: SafeUrl;

  protected countdown$ = this.countdown();
  protected status$ = this.store.select(selectGameStatus());
  protected solution$ = this.store.select(selectSolution());
  protected wordle$ = this.store.select(selectWordle());


  constructor() {

    merge(
      this.getLink(),
    ).pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getLink(): Observable<void> {
    return combineLatest([
      this.store.select(selectEvaluations()),
      this.store.select(selectRowIndex()),
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
      }),
    );
  }


  private countdown(): Observable<string> {
    return interval(1000).pipe(
      map(() => {
        const now = new Date();
        let hours = 2 - now.getHours();
        let minutes = 10 - now.getMinutes();

        if (minutes < 0) { minutes += 60; hours -= 1 }
        if (hours < 0) { hours += 24; }

        const seconds = 60 - now.getSeconds();
        if (hours + minutes + seconds === 1) { this.store.dispatch(getNewWord()); }

        return `${this.zeroPad(hours)}:${this.zeroPad(minutes)}:${this.zeroPad(seconds)}`;
      }),
      takeUntil(this.destroy$),
    );
  }

  public zeroPad(num: number, places = 2): string {
    return String(num).padStart(places, '0');
  }
}
