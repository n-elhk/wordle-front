import { Directive, Injector, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SquareAttempt } from '@models/board';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, interval, map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../store/core.reducer';
import { getNewWord } from '../store/wordle';
import { selectEvaluations, selectGameStatus, selectRowIndex, selectSolution, selectWordle } from '../store/wordle/wordle.selectors';


@Directive({
  selector: '[appShare]'
})
export class ShareDirective implements OnDestroy {

  public destroy$ = new Subject<void>();
  private domSanitizer = this.injector.get(DomSanitizer);

  public tweetText = '';
  public url = '';
  public safeUrl!: SafeUrl;

  public countdown$ = this.countdown();

  public status$ = this.store.select(selectGameStatus());
  public solution$ = this.store.select(selectSolution());
  public wordle$ = this.store.select(selectWordle());

  constructor(
    private injector: Injector,
    private store: Store<AppState>,
  ) {

    merge(
      this.getLink(),
    ).pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  getLink(): Observable<void> {
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
        let hours = 22 - now.getHours();
        let minutes = 39 - now.getMinutes();

        if (minutes < 0) { minutes += 60; hours -= 1 }
        if (hours < 0) { hours += 24; }

        const seconds = 60 - now.getSeconds();
        if (hours + minutes + seconds === 1) { this.store.dispatch(getNewWord()); }
        return `${hours}:${minutes}:${seconds}`;
      }),
      takeUntil(this.destroy$),
    );
  }

  async showDef(): Promise<void> {
    try {
      const {link} = await firstValueFrom(this.wordle$);
      window.location.href = link;
    } catch (error) {
      console.log(error);
    }
  }


  share(): void {
    try {
      window.location.href = this.url;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
