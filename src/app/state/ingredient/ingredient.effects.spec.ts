import { TestBed } from '@angular/core/testing';
import { IngredientService } from '@app/services/ingredient.service';
import * as IngredientActions from '@app/state/ingredient/ingredient.actions';
import { IngredientEffects } from '@app/state/ingredient/ingredient.effects';
import { mockIngredientDocument } from '@app/testing/data.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

describe('IngredientEffects', () => {
  let actions$: Observable<unknown>;
  let effects: IngredientEffects;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IngredientEffects,
        provideMockActions(() => actions$),
        { provide: IngredientService, useValue: jasmine.createSpyObj('IngredientService', ['list']) }
      ]
    });

    effects = TestBed.inject(IngredientEffects);
    ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('#listIngredients$', () => {
    it('should dispatch success action when listing ingredients was successfull', (done: DoneFn) => {
      ingredientServiceSpy.list.and.returnValue(of([mockIngredientDocument]));

      actions$ = of(IngredientActions.listIngredients());

      // eslint-disable-next-line @typescript-eslint/typedef
      effects.listIngredients$.subscribe((action) => {
        expect(action).toEqual(IngredientActions.listIngredientsSuccess({ ingredients: [mockIngredientDocument] }));
        done();
      });
    });

    it('should dispatch failure action when listing ingredients failed', (done: DoneFn) => {
      const error: string = 'something went wrong!';
      ingredientServiceSpy.list.and.returnValue(throwError(() => error));

      actions$ = of(IngredientActions.listIngredients());

      // eslint-disable-next-line @typescript-eslint/typedef
      effects.listIngredients$.subscribe((action) => {
        expect(action).toEqual(IngredientActions.listIngredientsFailure({ error: error }));
        done();
      });
    });
  });
});
