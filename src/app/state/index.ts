import { isDevMode } from '@angular/core';
import { effectReducer, EffectState } from '@app/effect/state/effect.reducer';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

export interface AppState {
  [StateFeatureEnum.Effect]: EffectState
}

export const reducers: ActionReducerMap<AppState> = {
  [StateFeatureEnum.Effect]: effectReducer
};


export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
