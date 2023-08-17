import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import { IngredientState } from '@app/state/ingredient/ingredient.reducer';
import * as IngredientSelectors from '@app/state/ingredient/ingredient.selector';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { mockIngredientDocument } from '@app/testing/data.mock';

describe('Ingredient Selectors', () => {
  describe('#selectIngredientState', () => {
    it('should return the feature state', () => {
      const result: IngredientState = IngredientSelectors.selectIngredientState({
        [StateFeatureEnum.Ingredient]: {
          ingredientsAreLoaded: false,
          ingredients: []
        }
      });

      expect(result).toEqual({
        ingredientsAreLoaded: false,
        ingredients: []
      });
    });
  });

  describe('#selectIngredientsAreLoaded', () => {
    it('should return if ingredients are loaded', () => {
      const result: boolean = IngredientSelectors.selectIngredientsAreLoaded({
        [StateFeatureEnum.Ingredient]: {
          ingredientsAreLoaded: true,
          ingredients: []
        }
      });

      expect(result).toBeTrue();
    });
  });

  describe('#selectIngredientsList', () => {
    it('should return ingredients list', () => {
      const result: IngredientDocument[] = IngredientSelectors.selectIngredientsList({
        [StateFeatureEnum.Ingredient]: {
          ingredientsAreLoaded: true,
          ingredients: [mockIngredientDocument]
        }
      });

      expect(result).toEqual([mockIngredientDocument]);
    });
  });
});
