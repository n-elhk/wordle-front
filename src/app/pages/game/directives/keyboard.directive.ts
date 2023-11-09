import { Directive, ElementRef, Injector, inject } from '@angular/core';
import { fromEvent, tap } from 'rxjs';
import { enterLetter } from '../helpers/keyboard.helper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: 'button[wdKeyboard]',
  standalone: true,
})
export class KeyboardDirective {
  /** Injection of {@link ElementRef}. */
  private element = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  /** Injection of {@link Injector}. */
  private injector = inject(Injector);

  constructor() {
    fromEvent(this.element.nativeElement, 'click')
      .pipe(
        tap(() => enterLetter(this.element.nativeElement.value, this.injector)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
