import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import * as IngredientActions from '@app/state/ingredient/ingredient.actions';
import { IngredientState, ingredientReducer, initialIngredientState } from '@app/state/ingredient/ingredient.reducer';
import { mockIngredientDocument } from '@app/testing/data.mock';
import { Action } from '@ngrx/store';

describe('Ingredient Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action: Action = {} as Action;
      const result: IngredientState = ingredientReducer(initialIngredientState, action);

      expect(result).toBe(initialIngredientState);
    });
  });

  describe('#listIngredients', () => {
    it('should return the previous state', () => {
      // eslint-disable-next-line @typescript-eslint/typedef
      const action = IngredientActions.listIngredients();
      const result: IngredientState = ingredientReducer(initialIngredientState, action);

      expect(result).toBe(initialIngredientState);
    });
  });

  describe('#listIngredientsSuccess', () => {
    it('should return the new state', () => {
      const ingredient1: IngredientDocument = { ...mockIngredientDocument, name: 'abc' };
      const ingredient2: IngredientDocument = { ...mockIngredientDocument, name: 'bca' };
      const ingredient3: IngredientDocument = { ...mockIngredientDocument, name: 'cba' };
      const ingredient4: IngredientDocument = { ...mockIngredientDocument, name: 'cba' };
      // eslint-disable-next-line @typescript-eslint/typedef
      const action = IngredientActions.listIngredientsSuccess({ ingredients: [ingredient2, ingredient3, ingredient1, ingredient4] });
      const result: IngredientState = ingredientReducer(initialIngredientState, action);

      expect(result).toEqual({
        ...initialIngredientState, ingredientsAreLoaded: true, ingredients: [ingredient2, ingredient3, ingredient1, ingredient4]
      });
    });
  });

  describe('#listIngredientsFailure', () => {
    it('should return the previous state', () => {
      // eslint-disable-next-line @typescript-eslint/typedef
      const action = IngredientActions.listIngredientsFailure({ error: 'something went wrong!' });
      const result: IngredientState = ingredientReducer(initialIngredientState, action);

      expect(result).toEqual({ ...initialIngredientState, ingredientsAreLoaded: false, ingredients: [] });
    });
  });
});
