import * as fromEffect from '@app/effect/state/effect.reducer';
import { StateFeatureEnum } from '@app/state/state-feature.enum';
import { createFeatureSelector, createSelector } from '@ngrx/store';

// [BUG]: cannot set type explicitly, because TS has issues with AppState
// https://github.com/ngrx/platform/issues/2780
// https://github.com/microsoft/TypeScript/issues/47226

// eslint-disable-next-line @typescript-eslint/typedef
export const selectEffectState = createFeatureSelector<fromEffect.EffectState>(StateFeatureEnum.Effect);

// eslint-disable-next-line @typescript-eslint/typedef
export const selectEffectsAreLoaded = createSelector(selectEffectState, (state: fromEffect.EffectState) => state.effectsAreLoaded);

// eslint-disable-next-line @typescript-eslint/typedef
export const selectEffectsList = createSelector(selectEffectState, (state: fromEffect.EffectState) => state.effects);
