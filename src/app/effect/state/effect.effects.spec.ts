import { TestBed } from '@angular/core/testing';
import * as EffectActions from '@app/effect/state/effect.actions';
import { EffectEffects } from '@app/effect/state/effect.effects';
import { EffectService } from '@app/services/effect.service';
import { mockEffect } from '@app/testing/data.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

describe('EffectEffects', () => {
  let actions$: Observable<unknown>;
  let effects: EffectEffects;
  let effectServiceSpy: jasmine.SpyObj<EffectService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EffectEffects,
        provideMockActions(() => actions$),
        { provide: EffectService, useValue: jasmine.createSpyObj('EffectService', ['list']) }
      ]
    });

    effects = TestBed.inject(EffectEffects);
    effectServiceSpy = TestBed.inject(EffectService) as jasmine.SpyObj<EffectService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('#listEffects$', () => {
    it('should dispatch success action when listing effects was successfull', (done: DoneFn) => {
      effectServiceSpy.list.and.returnValue(of([mockEffect]));

      actions$ = of(EffectActions.listEffects());

      // eslint-disable-next-line @typescript-eslint/typedef
      effects.listEffects$.subscribe((action) => {
        expect(action).toEqual(EffectActions.listEffectsSuccess({ effects: [mockEffect] }));
        done();
      });
    });

    it('should dispatch failure action when listing effects failer', (done: DoneFn) => {
      const error: string = 'something went wrong!';
      effectServiceSpy.list.and.returnValue(throwError(() => error));

      actions$ = of(EffectActions.listEffects());

      // eslint-disable-next-line @typescript-eslint/typedef
      effects.listEffects$.subscribe((action) => {
        expect(action).toEqual(EffectActions.listEffectsFailure({ error: error }));
        done();
      });
    });
  });
});
