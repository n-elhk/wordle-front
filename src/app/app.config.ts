import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';
import {
  reducers,
  metaReducers,
  initialState,
} from './core/store/core.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { ToastModule } from './core/toast/toast.module';

import { provideAnimations } from '@angular/platform-browser/animations';
import { wordleFeature } from '@store/wordle/wordle.reducer';
import { WordleEffects } from '@store/wordle/wordle.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideState(wordleFeature),
    provideStore(
      {
        ...reducers,
        // ...{ router: routerReducer },
      },
      {
        initialState,
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictActionWithinNgZone: true,
        },
      }
    ),
    provideEffects([WordleEffects]),

    importProvidersFrom(ToastModule.forRoot()),
  ],
};
