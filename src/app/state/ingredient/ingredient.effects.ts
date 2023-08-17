import { Injectable } from '@angular/core';
import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import { IngredientService } from '@app/services/ingredient.service';
import * as IngredientActions from '@app/state/ingredient/ingredient.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


@Injectable()
export class IngredientEffects {

  // eslint-disable-next-line @typescript-eslint/typedef
  public listIngredients$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IngredientActions.listIngredients),
      switchMap(() => this.ingredientService.list()
        .pipe(
          map((ingredients: IngredientDocument[]) => IngredientActions.listIngredientsSuccess({ ingredients: ingredients })),
          catchError((error) => of(IngredientActions.listIngredientsFailure({ error: error })))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private ingredientService: IngredientService
  ) { }
}
