import { inject, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAttemptsState, selectRowIndex } from '@store/wordle';

@Pipe({
  name: 'letter',
  standalone: true,
  pure: true,
})
export class LetterPipe implements PipeTransform {
  /** Injection of {@link Store}. */
  private readonly store = inject(Store);

  private readonly attempts = this.store.selectSignal(selectAttemptsState);

  private readonly rowIndex = this.store.selectSignal(selectRowIndex);

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
