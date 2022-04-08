import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
  HostListener, OnDestroy, QueryList, ViewChildren
} from '@angular/core';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, withLatestFrom, filter, mergeMap, tap, takeUntil, skip, switchMap } from 'rxjs';
import { KeyboardDirective } from '../shared/directives/keyboard.directive';
import { KeyboardService } from '../core/services/keyboard/keyboard.service';
import { StorageService } from '../core/services/storage/storage.service';
import { AppState } from '../core/store/core.reducer';
import {
  selectEvaluations, selectCurrentBoard, selectSolution, selectBoardState, selectLettersChoosed
} from '../core/store/wordle';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements AfterViewInit, OnDestroy {

  @ViewChildren(KeyboardDirective, { read: ElementRef }) public matButtonChildren!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('boardRow', { read: ElementRef }) public rowChildren!: QueryList<ElementRef<HTMLDivElement>>;

  public title = 'wordle';
  public evaluation$ = this.store.select(selectEvaluations());
  public currentBoard$ = this.store.select(selectCurrentBoard());
  public solution$ = this.store.select(selectSolution());

  public destroy$ = new Subject<void>();

  public game$ = combineLatest([
    this.evaluation$,
    this.currentBoard$,
  ]);

  constructor(
    private storageService: StorageService,
    private keyboardService: KeyboardService,
    private store: Store<AppState>,
  ) {
    this.game$.pipe(
      skip(1),
      switchMap(() => this.store.select(selectBoardState())),
      tap((res) => this.storageService.setStorage(StorageKey.BoardState, res)),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.keyboardService.enterLetter(event.key);
  }

  @HostListener('window:storage', ['$event'])
  touch(event: StorageEvent) {
    if (event.key === StorageKey.BoardState) {
      this.storageService.removeItem(event.key);
    }
  }

  ngAfterViewInit(): void {
    this.store.select(selectLettersChoosed()).pipe(
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
