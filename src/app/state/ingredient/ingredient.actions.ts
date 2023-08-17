import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import { createAction, props } from '@ngrx/store';

const enum IngredientActionTypeEnum {
  list = '[INGREDIENT] List ingredients',
  listSuccess = '[INGREDIENT] List ingredients success',
  listFailure = '[INGREDIENT] List ingredients failure',
}

// eslint-disable-next-line @typescript-eslint/typedef
export const listIngredients = createAction(
  IngredientActionTypeEnum.list
);

// eslint-disable-next-line @typescript-eslint/typedef
export const listIngredientsSuccess = createAction(
  IngredientActionTypeEnum.listSuccess,
  props<{ ingredients: IngredientDocument[] }>()
);

// eslint-disable-next-line @typescript-eslint/typedef
export const listIngredientsFailure = createAction(
  IngredientActionTypeEnum.listFailure,
  props<{ error: unknown }>()
);
