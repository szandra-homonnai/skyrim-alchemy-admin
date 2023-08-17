import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import * as IngredientActions from '@app/state/ingredient/ingredient.actions';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { Action, ActionReducer, FeatureSlice, createFeature, createReducer, on } from '@ngrx/store';

export interface IngredientState {
  ingredientsAreLoaded: boolean;
  ingredients: IngredientDocument[];
}

export const initialIngredientState: IngredientState = {
  ingredientsAreLoaded: false,
  ingredients: []
};


export const ingredientReducer: ActionReducer<IngredientState, Action> = createReducer(
  initialIngredientState,
  on(IngredientActions.listIngredientsSuccess,
    (state: IngredientState, { ingredients }: { ingredients: IngredientDocument[] }): IngredientState => {
      return {
        ...state,
        ingredientsAreLoaded: true,
        ingredients: ingredients
      };
    }),
  on(IngredientActions.listIngredientsFailure, (state: IngredientState): IngredientState => {
    return {
      ...state,
      ingredientsAreLoaded: initialIngredientState.ingredientsAreLoaded,
      ingredients: initialIngredientState.ingredients
    };
  })
);

export const ingredientFeature: FeatureSlice<IngredientState, Action> = createFeature({
  name: StateFeatureEnum.Ingredient,
  reducer: ingredientReducer
});

