import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WordleEffects } from './wordle.effects';
import { wordleFeature } from './wordle.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(wordleFeature),
    EffectsModule.forFeature([WordleEffects]),
  ],
  exports: [StoreModule],
})
export class WordleStoreModule {}
