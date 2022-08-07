import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromWordle from './wordle.reducer';
import { WordleEffects } from './wordle.effects';

/**
 * ParametersStoreModule will store any data on the front. It serves as a manager
 * state with strictly pure method for brady tachy context.
 * It provides a common way for GETting, POSTing (etc) data to the server.
 */
@NgModule({
  imports: [
    StoreModule.forFeature(fromWordle.featureName, fromWordle.reducer),
    EffectsModule.forFeature([WordleEffects]),
  ],
  exports: [StoreModule],
})
export class WordleStoreModule {
  constructor() { }
}
