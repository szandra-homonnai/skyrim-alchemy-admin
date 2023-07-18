import * as EffectActions from '@app/effect/state/effect.actions';
import { Effect } from '@app/interfaces/effect.interface';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { Action, ActionReducer, FeatureSlice, createFeature, createReducer, on } from '@ngrx/store';

export interface EffectState {
  effectsAreLoaded: boolean;
  effects: Effect[];
}

export const initialEffectState: EffectState = {
  effectsAreLoaded: false,
  effects: []
};


export const effectReducer: ActionReducer<EffectState, Action> = createReducer(
  initialEffectState,
  on(EffectActions.listEffectsSuccess, (state: EffectState, { effects }: { effects: Effect[] }): EffectState => {
    effects = effects.sort((a: Effect, b: Effect) => {
      if (a.name > b.name) {
        return 1;
      }

      if (b.name > a.name) {
        return -1;
      }

      return 0;
    });

    return {
      ...state,
      effectsAreLoaded: true,
      effects: effects
    }
  }),
  on(EffectActions.listEffectsFailure, (state: EffectState): EffectState => {
    return {
      ...state,
      effectsAreLoaded: initialEffectState.effectsAreLoaded,
      effects: initialEffectState.effects
    }
  })
);

export const effectFeature: FeatureSlice<EffectState, Action> = createFeature({
  name: StateFeatureEnum.Effect,
  reducer: effectReducer
});

