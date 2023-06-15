import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IngredientListComponent } from '@app/ingredient/components/ingredient-list/ingredient-list.component';
import { IngredientRoutingModule } from '@app/ingredient/ingredient-routing.module';

@NgModule({
  declarations: [
    IngredientListComponent
  ],
  imports: [
    CommonModule,
    IngredientRoutingModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class IngredientModule { }
