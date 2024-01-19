import {
  APP_INITIALIZER,
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
import { IconRegistery } from '@components/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

/** @docs-private */
export function initializeIcon(
  iconRegistery: IconRegistery,
  domSanitizer: DomSanitizer
) {
  return () => {
    const baseSvg = 'assets/icons';

    const icons = [
      { name: 'keyboard_return', path: `${baseSvg}/keyboard_return.svg` },
      { name: 'delete', path: `${baseSvg}/delete.svg` },
      { name: 'bar_chart', path: `${baseSvg}/bar_chart.svg` },
      { name: 'help', path: `${baseSvg}/help.svg` },
      { name: 'close', path: `${baseSvg}/close.svg` },
    ];

    icons.forEach(icon => {
      return iconRegistery.addSvgIcon(
        icon.name,
        domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
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

    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcon,
      deps: [IconRegistery, DomSanitizer],
      multi: true,
    },
  ],
};
