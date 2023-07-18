import { Effect } from '@app/interfaces/effect.interface';
import { createAction, props } from '@ngrx/store';

const enum EffectActionTypeEnum {
  list = '[EFFECT] List effects',
  listSuccess = '[EFFECT] List effects success',
  listFailure = '[EFFECT] List effects failure',
}

// eslint-disable-next-line @typescript-eslint/typedef
export const listEffects = createAction(
  EffectActionTypeEnum.list
);

// eslint-disable-next-line @typescript-eslint/typedef
export const listEffectsSuccess = createAction(
  EffectActionTypeEnum.listSuccess,
  props<{ effects: Effect[] }>()
);

// eslint-disable-next-line @typescript-eslint/typedef
export const listEffectsFailure = createAction(
  EffectActionTypeEnum.listFailure,
  props<{ error: unknown }>()
);
