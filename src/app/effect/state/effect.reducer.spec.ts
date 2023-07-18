import * as EffectActions from '@app/effect/state/effect.actions';
import { EffectState, effectReducer, initialEffectState } from '@app/effect/state/effect.reducer';
import { Effect } from '@app/interfaces/effect.interface';
import { mockEffect } from '@app/testing/data.mock';
import { Action } from '@ngrx/store';

describe('Effect Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action: Action = {} as Action;
      const result: EffectState = effectReducer(initialEffectState, action);

      expect(result).toBe(initialEffectState);
    });
  });

  describe('#listEffects', () => {
    it('should return the previous state', () => {
      // eslint-disable-next-line @typescript-eslint/typedef
      const action = EffectActions.listEffects();
      const result: EffectState = effectReducer(initialEffectState, action);

      expect(result).toBe(initialEffectState);
    });
  });

  describe('#listEffectsSuccess', () => {
    it('should return the previous state', () => {
      const effect1: Effect = { ...mockEffect, name: 'abc' };
      const effect2: Effect = { ...mockEffect, name: 'bca' };
      const effect3: Effect = { ...mockEffect, name: 'cba' };
      const effect4: Effect = { ...mockEffect, name: 'cba' };
      // eslint-disable-next-line @typescript-eslint/typedef
      const action = EffectActions.listEffectsSuccess({ effects: [effect2, effect3, effect1, effect4] });
      const result: EffectState = effectReducer(initialEffectState, action);

      expect(result).toEqual({ ...initialEffectState, effectsAreLoaded: true, effects: [effect1, effect2, effect3, effect4] });
    });
  });

  describe('#listEffectsFailure', () => {
    it('should return the previous state', () => {
      // eslint-disable-next-line @typescript-eslint/typedef
      const action = EffectActions.listEffectsFailure({ error: 'something went wrong!' });
      const result: EffectState = effectReducer(initialEffectState, action);

      expect(result).toEqual({ ...initialEffectState, effectsAreLoaded: false, effects: [] });
    });
  });
});
