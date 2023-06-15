import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IngredientFormComponent } from '@app/ingredient/components/ingredient-form/ingredient-form.component';
import { IngredientListComponent } from '@app/ingredient/components/ingredient-list/ingredient-list.component';
import { IngredientRoutingModule } from '@app/ingredient/ingredient-routing.module';

@NgModule({
  declarations: [
    IngredientListComponent,
    IngredientFormComponent
  ],
  imports: [
    CommonModule,
    IngredientRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class IngredientModule { }
