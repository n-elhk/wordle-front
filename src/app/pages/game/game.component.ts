import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Injector,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import {
  tap,
  skip,
  switchMap,
  map,
  fromEvent,
  merge,
  throttleTime,
} from 'rxjs';
import {
  selectBoardState,
  selectCurrentBoard,
  selectEvaluations,
  selectLettersChoosed,
  selectSolution,
} from '@store/wordle';
import { StorageService } from '@services/storage/storage.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { untilDestroyed } from '@common/functions';
import { CommonModule } from '@angular/common';
import { LetterPipe } from '@common/pipes';
import { SvgIcon } from '@components/icon/icon';
import { KeyboardDirective } from './directives/keyboard.directive';
import { enterLetter } from './helpers/keyboard.helper';

@Component({
  selector: 'wd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LetterPipe, CommonModule, SvgIcon, KeyboardDirective],
})
export class GameComponent implements AfterViewInit {
  private destroy$ = untilDestroyed();

  /** Injection of {@link Injector}. */
  private injector = inject(Injector);

  /** Injection of {@link Store}. */
  private store = inject(Store);

  /** Injection of {@link StorageService}. */
  private storageService = inject(StorageService);

  @ViewChildren(KeyboardDirective, { read: ElementRef })
  public matButtonChildren!: QueryList<ElementRef<HTMLButtonElement>>;

  public readonly evaluation = this.store.selectSignal(selectEvaluations);

  public evaluations = this.store.selectSignal(selectEvaluations);

  public readonly currentBoard = this.store.selectSignal(selectCurrentBoard);

  public readonly solution = this.store.selectSignal(selectSolution);

  constructor() {
    merge(
      fromEvent<KeyboardEvent>(document, 'keydown', { passive: true }).pipe(
        throttleTime(200, undefined, { leading: true, trailing: true }),
        map(ev => enterLetter(ev.key, this.injector))
      ),

      toObservable(this.currentBoard).pipe(
        skip(1),
        switchMap(() => this.store.select(selectBoardState)),
        tap(res => this.storageService.setStorage(StorageKey.BoardState, res))
      )
    )
      .pipe(takeUntilDestroyed())
      .subscribe();
  }
  public ngAfterViewInit(): void {
    this.store
      .select(selectLettersChoosed)
      .pipe(
        tap(([partialLetters, correctLetters, absentLetters]) => {
          this.matButtonChildren.forEach(({ nativeElement }) => {
            if (correctLetters.indexOf(nativeElement.value) > -1) {
              nativeElement.classList.add('correct');
              nativeElement.classList.remove('partial');
            } else if (partialLetters.indexOf(nativeElement.value) > -1) {
              nativeElement.classList.add('partial');
            } else if (absentLetters.indexOf(nativeElement.value) > -1) {
              nativeElement.classList.add('absent');
            }
          });
        }),
        this.destroy$()
      )
      .subscribe();
  }

  @HostListener('window:storage', ['$event'])
  private touch(event: StorageEvent): void {
    if (event.key === StorageKey.BoardState) {
      this.storageService.removeItem(event.key);
    }
  }
}
