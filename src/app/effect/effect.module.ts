import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EffectListComponent } from '@app/effect/components/effect-list/effect-list.component';
import { EffectRoutingModule } from '@app/effect/effect-routing.module';

@NgModule({
  declarations: [
    EffectListComponent
  ],
  imports: [
    CommonModule,
    EffectRoutingModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ]
})
export class EffectModule { }
