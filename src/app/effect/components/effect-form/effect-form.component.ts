import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Effect } from '@app/interfaces/effect.interface';
import { EffectService } from '@app/services/effect.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-effect-form',
  templateUrl: './effect-form.component.html',
  styleUrls: ['./effect-form.component.scss']
})
export class EffectFormComponent implements OnDestroy {
  private unsubsribe: Subject<boolean> = new Subject();
  private _editedEffect: Effect;

  public form: FormGroup;
  public schools: string[];
  public types: string[];

  @ViewChild(FormGroupDirective, { static: false }) public formGroupDirective: FormGroupDirective;

  @Input() public get editedEffect(): Effect {
    return this._editedEffect;
  }
  public set editedEffect(effect: Effect) {
    this._editedEffect = effect;

    this.resetForm();

    if (effect) {
      this.loadDataIntoForm();
    }
  }

  @Output() public editedEffectChange: EventEmitter<Effect> = new EventEmitter();

  constructor(
    private matSnackBar: MatSnackBar,
    private effectService: EffectService
  ) {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      school: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required)
    });

    this.schools = ['Restoration', 'Destruction', 'Alteration', 'Illusion'];
    this.types = ['Defensive', 'Offensive', 'Restorative'];
  }

  private loadDataIntoForm(): void {
    this.form.get('name').setValue(this.editedEffect.name);
    this.form.get('school').setValue(this.editedEffect.school);
    this.form.get('type').setValue(this.editedEffect.type);
  }

  private onSaveSuccess(): void {
    this.matSnackBar.open('Effect was successfully saved!');
    this.clearForm();
  }

  private onSaveFail(): void {
    this.matSnackBar.open('Effect saving failed!');
  }

  public ngOnDestroy(): void {
    this.unsubsribe.next(false);
    this.unsubsribe.complete();
  }

  public clearForm(): void {
    this.editedEffect = null;
    this.editedEffectChange.emit(null);
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
      const effect: Effect = this.form.value;

      if (this.editedEffect) {
        this.effectService.update(this.editedEffect.id, effect)
          .then(() => this.onSaveSuccess())
          .catch(() => this.onSaveFail());
      } else {
        this.effectService.create(effect)
          .then(() => this.onSaveSuccess())
          .catch(() => this.onSaveFail());
      }
    }
  }
}
