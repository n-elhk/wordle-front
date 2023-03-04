import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers, initialState } from './core.reducer';
import { WordleStoreModule } from './wordle/wordle.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env';

/**
 * AppStoreModule will store any data on the front. It serves as a manager
 * state with strictly pure method.
 * It provides a common way for GETting, POSTing (etc) data to the server.
 */
@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    StoreModule.forRoot({
      ...reducers,
      // ...{ router: routerReducer },
    }, {
      initialState,
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
      },
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    WordleStoreModule,
  ],
  exports: [
    StoreModule,
  ],
})
export class AppStoreModule { }
