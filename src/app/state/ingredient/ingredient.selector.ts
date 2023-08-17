import * as fromIngredient from '@app/state/ingredient/ingredient.reducer';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { createFeatureSelector, createSelector } from '@ngrx/store';

// [BUG]: cannot set type explicitly, because TS has issues with AppState
// https://github.com/ngrx/platform/issues/2780
// https://github.com/microsoft/TypeScript/issues/47226

// eslint-disable-next-line @typescript-eslint/typedef
export const selectIngredientState = createFeatureSelector<fromIngredient.IngredientState>(StateFeatureEnum.Ingredient);

// eslint-disable-next-line @typescript-eslint/typedef
export const selectIngredientsAreLoaded = createSelector(selectIngredientState, (state: fromIngredient.IngredientState) => state.ingredientsAreLoaded);

// eslint-disable-next-line @typescript-eslint/typedef
export const selectIngredientsList = createSelector(selectIngredientState, (state: fromIngredient.IngredientState) => state.ingredients);
