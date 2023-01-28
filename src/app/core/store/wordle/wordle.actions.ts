import { Board } from '@models/board';
import { Wordle } from '@models/wordle';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { featureName } from './feature.name';

export const wordleActions = createActionGroup({
    source: featureName,
    events: {
        ['hydrate']: emptyProps(),
        ['hydrate failure']: props<{ error: string }>(),
        ['hydrate success']: props<{ gameBoard: Board, wordle: Wordle }>(),

        ['get word']: emptyProps(),
        ['get word failure']: props<{ error: string }>(),
        ['get word success']: props<{  word: string }>(),

        ['choose letter']: props<{ letter: string }>(), 
        ['choose letter failure']: props<{ error: string }>(),
        ['choose letter success']: props<{  attempts: string[]}>(),

        ['delete letter']: emptyProps(),
        ['delete letter failure']: props<{ error: string }>(),
        ['delete letter success']: props<{  attempts: string[] }>(),

        ['enter word']: props<{ word: string, boardState: Board, solution: string }>(),
        ['enter word failure']: props<{ error: string }>(),
        ['enter word success']: props<{ boardState: Board }>(),

        ['row not guessed']: props<{ error: string }>(),
        ['row not guessed success']: emptyProps(),

        ['get new word']: emptyProps(),
    }
});

