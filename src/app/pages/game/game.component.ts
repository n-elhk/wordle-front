import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
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
import { KeyboardService } from '@services/keyboard/keyboard.service';
import { StorageService } from '@services/storage/storage.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { untilDestroyed } from '@common/functions';
import { CommonModule } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { LetterPipe } from '@common/pipes';
import { KeyboardDirective } from '@common/directives';
import { SvgIcon } from "@components/icon/icon";

@Component({
    selector: 'wd-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [LetterPipe, CommonModule, LetDirective, SvgIcon]
})
export class GameComponent implements OnInit, AfterViewInit {
  private destroy$ = untilDestroyed();

  /** Injection of {@link Store}. */
  private store = inject(Store);

  /** Injection of {@link StorageService}. */
  private storageService = inject(StorageService);

  /** Injection of {@link KeyboardService}. */
  private keyboardService = inject(KeyboardService);

  @ViewChildren(KeyboardDirective, { read: ElementRef })
  public matButtonChildren!: QueryList<ElementRef<HTMLButtonElement>>;

  protected title = 'wordle';
  protected evaluation$ = this.store.select(selectEvaluations);

  public evaluations = toSignal(this.store.select(selectEvaluations), {
    initialValue: [],
  });

  protected currentBoard$ = this.store.select(selectCurrentBoard);

  public currentBoard = toSignal(this.currentBoard$, {
    initialValue: '',
  });

  public solution = toSignal(this.store.select(selectSolution), {
    initialValue: '',
  });

  public ngOnInit(): void {
    merge(
      fromEvent<KeyboardEvent>(document, 'keydown', { passive: true }).pipe(
        throttleTime(200, undefined, { leading: true, trailing: true }),
        map((ev) => this.keyboardService.enterLetter(ev.key))
      ),

      this.currentBoard$.pipe(
        skip(1),
        switchMap(() => this.store.select(selectBoardState)),
        tap((res) => this.storageService.setStorage(StorageKey.BoardState, res))
      )
    )
      .pipe(this.destroy$())
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

  // @HostListener('window:storage', ['$event'])
  // private touch(event: StorageEvent): void {
  //   if (event.key === StorageKey.BoardState) {
  //     this.storageService.removeItem(event.key);
  //   }
  // }
}
