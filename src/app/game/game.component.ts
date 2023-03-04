import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
  HostListener, inject, OnDestroy, OnInit, QueryList, ViewChildren
} from '@angular/core';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, tap, takeUntil, skip, switchMap, map, fromEvent, merge, throttleTime } from 'rxjs';
import { selectBoardState, selectCurrentBoard, selectEvaluations, selectLettersChoosed, selectSolution } from '@store/wordle';
import { KeyboardService } from '@services/keyboard/keyboard.service';
import { StorageService } from '@services/storage/storage.service';
import { KeyboardDirective } from '@shared/directives/keyboard.directive';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private store = inject(Store);
  private storageService = inject(StorageService);
  private keyboardService = inject(KeyboardService);

  @ViewChildren(KeyboardDirective, { read: ElementRef }) public matButtonChildren!: QueryList<ElementRef<HTMLButtonElement>>;

  protected title = 'wordle';
  protected evaluation$ = this.store.select(selectEvaluations);
  protected currentBoard$ = this.store.select(selectCurrentBoard);
  protected solution$ = this.store.select(selectSolution);

  protected game$ = combineLatest([
    this.evaluation$,
    this.currentBoard$,
  ]).pipe(
    map(([evaluation, currentBoard]) => ({ evaluation, currentBoard }))
  );

  public ngOnInit(): void {
    merge(
      fromEvent<KeyboardEvent>(document, 'keydown', { passive: true }).pipe(
        throttleTime(200, undefined, { leading: true, trailing: true }),
        map(ev => this.keyboardService.enterLetter(ev.key)),
      ),

      this.game$.pipe(
        skip(1),
        switchMap(() => this.store.select(selectBoardState)),
        tap((res) => this.storageService.setStorage(StorageKey.BoardState, res)),
      ),
    ).pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  public ngAfterViewInit(): void {
    this.store.select(selectLettersChoosed).pipe(
      tap(([partialLetters, correctLetters, absentLetters]) => {
        this.matButtonChildren.forEach(({ nativeElement }) => {
          if (correctLetters.indexOf(nativeElement.value) > -1) {
            nativeElement.classList.add('correct');
            nativeElement.classList.remove('partial');
          }
          else if (partialLetters.indexOf(nativeElement.value) > -1) { nativeElement.classList.add('partial'); }
          else if (absentLetters.indexOf(nativeElement.value) > -1) { nativeElement.classList.add('absent'); }
        });
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:storage', ['$event'])
  touch(event: StorageEvent): void {
    if (event.key === StorageKey.BoardState) {
      this.storageService.removeItem(event.key);
    }
  }

}
