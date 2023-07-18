import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EffectFormComponent } from '@app/effect/components/effect-form/effect-form.component';
import { EffectListComponent } from '@app/effect/components/effect-list/effect-list.component';
import { EffectRoutingModule } from '@app/effect/effect-routing.module';
import { EffectEffects } from '@app/effect/state/effect.effects';
import { effectFeature } from '@app/effect/state/effect.reducer';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    EffectListComponent,
    EffectFormComponent
  ],
  imports: [
    CommonModule,
    EffectRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    ConfirmDialogComponent,
    StoreModule.forFeature(effectFeature),
    EffectsModule.forFeature([EffectEffects])
  ]
})
export class EffectModule { }
