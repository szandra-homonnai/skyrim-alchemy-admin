import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Effect } from '@app/interfaces/effect.interface';
import { Game } from '@app/interfaces/game.interface';
import { Ingredient, IngredientDocument } from '@app/interfaces/ingredient.interface';
import { EffectService } from '@app/services/effect.service';
import { GameService } from '@app/services/game.service';
import { IngredientService } from '@app/services/ingredient.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent implements OnDestroy {
  private unsubsribe: Subject<boolean> = new Subject();
  private _editedIngredient: IngredientDocument;

  public form: FormGroup;
  public effects: Effect[];
  public games: Game[];

  @ViewChild(FormGroupDirective, { static: false }) public formGroupDirective: FormGroupDirective;

  @Input() public get editedIngredient(): IngredientDocument {
    return this._editedIngredient;
  }
  public set editedIngredient(ingredient: IngredientDocument) {
    this._editedIngredient = ingredient;

    this.resetForm();

    if (ingredient) {
      this.loadDataIntoForm();
    }
  }

  @Output() public editedIngredientChange: EventEmitter<IngredientDocument> = new EventEmitter();

  constructor(
    private matSnackBar: MatSnackBar,
    private effectService: EffectService,
    private gameService: GameService,
    private ingredientService: IngredientService
  ) {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      effect1: new FormControl(null, Validators.required),
      effect2: new FormControl(null, Validators.required),
      effect3: new FormControl(null, Validators.required),
      effect4: new FormControl(null, Validators.required),
      game: new FormControl(null, Validators.required)
    });

    this.effectService.list()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: Effect[]) => this.effects = items);

    this.gameService.list()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: Game[]) => this.games = items);
  }

  private loadDataIntoForm(): void {
    this.form.get('name').setValue(this.editedIngredient.name);
    this.form.get('effect1').setValue(this.editedIngredient.effect1.id);
    this.form.get('effect2').setValue(this.editedIngredient.effect2.id);
    this.form.get('effect3').setValue(this.editedIngredient.effect3.id);
    this.form.get('effect4').setValue(this.editedIngredient.effect4.id);
    this.form.get('game').setValue(this.editedIngredient.game.id);
  }

  private onSaveSuccess(): void {
    this.matSnackBar.open('Ingredient was successfully saved!');
    this.clearForm();
  }

  private onSaveFail(): void {
    this.matSnackBar.open('Ingredient saving failed!');
  }

  public ngOnDestroy(): void {
    this.unsubsribe.next(false);
    this.unsubsribe.complete();
  }

  public clearForm(): void {
    this.editedIngredient = null;
    this.editedIngredientChange.emit(null);
    this.resetForm();
  }

  public resetForm(): void {
    this.form.reset();

    if (this.formGroupDirective) {
      this.formGroupDirective.resetForm();
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const ingredient: Ingredient = this.form.value;

      if (this.editedIngredient) {
        this.ingredientService.update(this.editedIngredient.id, ingredient)
          .then(() => this.onSaveSuccess())
          .catch(() => this.onSaveFail());
      } else {
        this.ingredientService.create(ingredient)
          .then(() => this.onSaveSuccess())
          .catch(() => this.onSaveFail());
      }
    }
  }
}
