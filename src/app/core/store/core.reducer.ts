import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

export interface AppState {
  dummy: boolean;
}

export const initialState: AppState = {
  dummy: false,
};

export const reducers: ActionReducerMap<AppState> = {
  dummy: () => true,
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
