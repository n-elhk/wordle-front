import { DestroyRef, Directive, inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Directive({
  standalone: true,
})
export class DestroyDirective {
  private readonly destroyRef = inject(DestroyRef);
  readonly destroy$ = new ReplaySubject<void>(1);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }
}
