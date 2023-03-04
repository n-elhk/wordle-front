import { inject, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAttemptsState, selectRowIndex } from '@store/wordle';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';

@Pipe({
  name: 'letter',
  standalone: true,
  pure: true,
})
export class LetterPipe implements PipeTransform {

  private store = inject(Store);

  transform(value: string, index: number, index2: number): Observable<string> {
    return forkJoin([
      firstValueFrom(this.store.select(selectAttemptsState)),
      firstValueFrom(this.store.select(selectRowIndex)),
    ]).pipe(
      map(([attempts, rowIndex]) => {
        const letters = Array.from(value);
        if (index < rowIndex) { return Array.from(attempts[index])[index2]; }
        else if (index === rowIndex) { return (letters[index2] ? letters[index2] : ''); }
        return '';
      }),
    );
  }
}
