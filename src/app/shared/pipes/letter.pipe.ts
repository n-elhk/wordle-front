import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../core/store/core.reducer';
import { selectAttemptsState, selectRowIndex } from '../../core/store/wordle';

@Pipe({
  name: 'letter',
  pure: true,
})
export class LetterPipe implements PipeTransform {

  constructor(private store: Store<AppState>) { }
  transform(value: string, index: number, index2: number): Observable<string> {
    return combineLatest(
      [
        this.store.select(selectAttemptsState()),
        this.store.select(selectRowIndex()),
      ]
    ).pipe(
      take(1),
      map(([attempts, rowIndex]) => {
        const letters = Array.from(value);
        if (index < rowIndex) { return Array.from(attempts[index])[index2]; }
        // else if (index === rowIndex) { return (letters[index2] ? letters[index2] : '').toUpperCase(); }
        else if (index === rowIndex) { return (letters[index2] ? letters[index2] : ''); }
        return '';
      })
    )
  }
}
