import { EffectState } from '@app/effect/state/effect.reducer';
import * as EffectSelectors from '@app/effect/state/effect.selectors';
import { Effect } from '@app/interfaces/effect.interface';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { mockEffect } from '@app/testing/data.mock';

describe('Effect Selectors', () => {
  describe('#selectEffectState', () => {
    it('should return the feature state', () => {
      const result: EffectState = EffectSelectors.selectEffectState({
        [StateFeatureEnum.Effect]: {
          effectsAreLoaded: false,
          effects: []
        }
      });

      expect(result).toEqual({
        effectsAreLoaded: false,
        effects: []
      });
    });
  });

  describe('#selectEffectsAreLoaded', () => {
    it('should return if effects are loaded', () => {
      const result: boolean = EffectSelectors.selectEffectsAreLoaded({
        [StateFeatureEnum.Effect]: {
          effectsAreLoaded: true,
          effects: []
        }
      });

      expect(result).toBeTrue();
    });
  });

  describe('#selectEffectsList', () => {
    it('should return effects list', () => {
      const result: Effect[] = EffectSelectors.selectEffectsList({
        [StateFeatureEnum.Effect]: {
          effectsAreLoaded: true,
          effects: [mockEffect]
        }
      });

      expect(result).toEqual([mockEffect]);
    });
  });
});
