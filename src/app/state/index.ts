import { isDevMode } from '@angular/core';
import { effectReducer, EffectState } from '@app/effect/state/effect.reducer';
import { ingredientReducer, IngredientState } from '@app/state/ingredient/ingredient.reducer';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

export interface AppState {
  [StateFeatureEnum.Effect]: EffectState,
  [StateFeatureEnum.Ingredient]: IngredientState
}

export const reducers: ActionReducerMap<AppState> = {
  [StateFeatureEnum.Effect]: effectReducer,
  [StateFeatureEnum.Ingredient]: ingredientReducer
};


export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
