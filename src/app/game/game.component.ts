import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
  HostListener, OnDestroy, QueryList, ViewChildren
} from '@angular/core';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, tap, takeUntil, skip, switchMap, map } from 'rxjs';
import { selectBoardState, selectCurrentBoard, selectEvaluations, selectLettersChoosed, selectSolution } from '@store/wordle';
import { KeyboardService } from '@services/keyboard/keyboard.service';
import { StorageService } from '@services/storage/storage.service';
import { KeyboardDirective } from '@shared/directives/keyboard.directive';
import { AppState } from '@store/core.reducer';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements AfterViewInit, OnDestroy {

  @ViewChildren(KeyboardDirective, { read: ElementRef }) public matButtonChildren!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('boardRow', { read: ElementRef }) public rowChildren!: QueryList<ElementRef<HTMLDivElement>>;

  protected title = 'wordle';
  protected evaluation$ = this.store.select(selectEvaluations);
  protected currentBoard$ = this.store.select(selectCurrentBoard);
  protected solution$ = this.store.select(selectSolution);

  private destroy$ = new Subject<void>();

  protected game$ = combineLatest([
    this.evaluation$,
    this.currentBoard$,
  ]).pipe(
    map(([evaluation, currentBoard]) => ({evaluation, currentBoard}))
  );

  constructor(
    private storageService: StorageService,
    private keyboardService: KeyboardService,
    private store: Store<AppState>,
  ) {
    this.game$.pipe(
      skip(1),
      switchMap(() => this.store.select(selectBoardState)),
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

}
