import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';

export interface AppState {
  dummy: boolean;
}

export const initialState: AppState = {
  dummy: false,
};

export const reducers: ActionReducerMap<AppState> = {
  dummy: () => true,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
