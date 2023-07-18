import { Injectable } from '@angular/core';
import * as EffectActions from '@app/effect/state/effect.actions';
import { Effect } from '@app/interfaces/effect.interface';
import { EffectService } from '@app/services/effect.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


@Injectable()
export class EffectEffects {

  // eslint-disable-next-line @typescript-eslint/typedef
  public listEffects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EffectActions.listEffects),
      switchMap(() => this.effectsService.list()
        .pipe(
          map((effects: Effect[]) => EffectActions.listEffectsSuccess({ effects: effects })),
          catchError((error: unknown) => of(EffectActions.listEffectsFailure({ error: error })))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private effectsService: EffectService
  ) { }
}
