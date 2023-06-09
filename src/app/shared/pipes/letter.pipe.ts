import { inject, Pipe, PipeTransform } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectAttemptsState, selectRowIndex } from '@store/wordle';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';

@Pipe({
  name: 'letter',
  standalone: true,
  pure: true,
})
export class LetterPipe implements PipeTransform {
  /** Injection of {@link Store}. */
  private store = inject(Store);

  /** Injection of {@link Store}. */
  private attempts = toSignal(this.store.select(selectAttemptsState), {
    initialValue: [] as string[],
  });

  private rowIndex = toSignal(this.store.select(selectRowIndex), {
    initialValue: 0,
  });

  public transform(value: string, index: number, index2: number): string {
    const attempts = this.attempts();
    const rowIndex = this.rowIndex();

    const letters = Array.from(value);
    if (index < rowIndex) {
      return Array.from(attempts[index])[index2];
    } else if (index === rowIndex) {
      return letters[index2] ? letters[index2] : '';
    }
    return '';
  }
}
