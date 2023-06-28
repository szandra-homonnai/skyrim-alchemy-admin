import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentReference } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientFormComponent } from '@app/ingredient/components/ingredient-form/ingredient-form.component';
import { EffectService } from '@app/services/effect.service';
import { GameService } from '@app/services/game.service';
import { IngredientService } from '@app/services/ingredient.service';
import { mockEffect, mockGame, mockIngredientDocument } from '@app/testing/data.mock';
import { of } from 'rxjs';

describe('IngredientFormComponent', () => {
  let component: IngredientFormComponent;
  let fixture: ComponentFixture<IngredientFormComponent>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let effectServiceSpy: jasmine.SpyObj<EffectService>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IngredientFormComponent
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
      ],
      providers: [
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        { provide: EffectService, useValue: jasmine.createSpyObj('EffectService', ['list']) },
        { provide: GameService, useValue: jasmine.createSpyObj('GameService', ['list']) },
        { provide: IngredientService, useValue: jasmine.createSpyObj('IngredientService', ['create', 'update']) }
      ]
    })
      .compileComponents();

    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    effectServiceSpy = TestBed.inject(EffectService) as jasmine.SpyObj<EffectService>;
    effectServiceSpy.list.and.returnValue(of([mockEffect]));

    gameServiceSpy = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
    gameServiceSpy.list.and.returnValue(of([mockGame]));

    ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;

    fixture = TestBed.createComponent(IngredientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(effectServiceSpy.list).toHaveBeenCalled();
    expect(component.effects).toEqual([mockEffect]);
    expect(gameServiceSpy.list).toHaveBeenCalled();
    expect(component.games).toEqual([mockGame]);
  });

  describe('#editedIngredient setter - getter', () => {
    it('should set edited ingredient, reset form and not update form values when ingredient is empty', () => {
      spyOn(component, 'resetForm');
      spyOn(component.form, 'setValue');

      component.editedIngredient = null;

      expect(component.editedIngredient).toBeNull();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.form.setValue).not.toHaveBeenCalled();
    });

    it('should set edited ingredient, reset form and update form values when ingredient has value', () => {
      spyOn(component, 'resetForm');
      spyOn(component.form, 'setValue').and.callThrough();

      component.editedIngredient = mockIngredientDocument;

      expect(component.editedIngredient).toEqual(mockIngredientDocument);
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.form.setValue).toHaveBeenCalled();
      expect(component.form.value).toEqual({
        name: mockIngredientDocument.name,
        effect1: mockIngredientDocument.effect1.id,
        effect2: mockIngredientDocument.effect2.id,
        effect3: mockIngredientDocument.effect3.id,
        effect4: mockIngredientDocument.effect4.id,
        game: mockIngredientDocument.game.id
      });
    });
  });

  describe('#clearForm', () => {
    it('should set edited ingredient to null, emit change and reset form', () => {
      spyOn(component, 'resetForm');
      spyOn(component.editedIngredientChange, 'emit');
      component.editedIngredient = mockIngredientDocument;

      component.clearForm();

      expect(component.editedIngredient).toBeNull();
      expect(component.editedIngredientChange.emit).toHaveBeenCalledWith(null);
      expect(component.resetForm).toHaveBeenCalled();
    });
  });

  describe('#resetForm', () => {
    it('should reset form and reset form directive when it is available', () => {
      spyOn(component.form, 'reset');
      spyOn(component.formGroupDirective, 'resetForm');

      component.resetForm();

      expect(component.form.reset).toHaveBeenCalled();
      expect(component.formGroupDirective.resetForm).toHaveBeenCalled();
    });

    it('should only reset form when form directive is unavailable', () => {
      spyOn(component.form, 'reset');
      component.formGroupDirective = null

      component.resetForm();

      expect(component.form.reset).toHaveBeenCalled();
    });
  });

  describe('#onSubmit', () => {
    it('should do nothing when form is invalid', () => {
      component.form.patchValue({ name: null });
      component.onSubmit();

      expect(ingredientServiceSpy.create).not.toHaveBeenCalled();
    });

    it('should handle susscessful create request', (done: DoneFn) => {
      const promise: Promise<DocumentReference> = new Promise((resolve: (value: DocumentReference) => void) => resolve(null));
      ingredientServiceSpy.create.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.form.setValue({
        name: mockIngredientDocument.name,
        effect1: mockIngredientDocument.effect1.id,
        effect2: mockIngredientDocument.effect2.id,
        effect3: mockIngredientDocument.effect3.id,
        effect4: mockIngredientDocument.effect4.id,
        game: mockIngredientDocument.game.id
      });
      component.onSubmit();

      expect(ingredientServiceSpy.create).toHaveBeenCalled();

      promise.then(() => {
        expect(matSnackBarSpy.open).toHaveBeenCalled();
        expect(component.clearForm).toHaveBeenCalled();
        done();
      });
    });

    it('should handle failed create request', (done: DoneFn) => {
      const promise: Promise<DocumentReference> = new Promise(
        (resolve: (value: DocumentReference) => void, reject: (reason: string) => void) => reject('Error!')
      );
      ingredientServiceSpy.create.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.form.setValue({
        name: mockIngredientDocument.name,
        effect1: mockIngredientDocument.effect1.id,
        effect2: mockIngredientDocument.effect2.id,
        effect3: mockIngredientDocument.effect3.id,
        effect4: mockIngredientDocument.effect4.id,
        game: mockIngredientDocument.game.id
      });
      component.onSubmit();

      expect(ingredientServiceSpy.create).toHaveBeenCalled();

      promise
        .catch(() => { return; })
        .finally(() => {
          expect(matSnackBarSpy.open).toHaveBeenCalled();
          expect(component.clearForm).not.toHaveBeenCalled();
          done();
        });
    });

    it('should handle susscessful update request', (done: DoneFn) => {
      const promise: Promise<void> = new Promise((resolve: (value: void) => void) => resolve());
      ingredientServiceSpy.update.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.editedIngredient = mockIngredientDocument;
      component.form.setValue({
        name: mockIngredientDocument.name,
        effect1: mockIngredientDocument.effect1.id,
        effect2: mockIngredientDocument.effect2.id,
        effect3: mockIngredientDocument.effect3.id,
        effect4: mockIngredientDocument.effect4.id,
        game: mockIngredientDocument.game.id
      });
      component.onSubmit();

      expect(ingredientServiceSpy.update).toHaveBeenCalled();

      promise.then(() => {
        expect(matSnackBarSpy.open).toHaveBeenCalled();
        expect(component.clearForm).toHaveBeenCalled();
        done();
      });
    });

    it('should handle failed update request', (done: DoneFn) => {
      const promise: Promise<void> = new Promise(
        (resolve: (value: void) => void, reject: (reason: string) => void) => reject('Error!')
      );
      ingredientServiceSpy.update.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.editedIngredient = mockIngredientDocument;
      component.form.setValue({
        name: mockIngredientDocument.name,
        effect1: mockIngredientDocument.effect1.id,
        effect2: mockIngredientDocument.effect2.id,
        effect3: mockIngredientDocument.effect3.id,
        effect4: mockIngredientDocument.effect4.id,
        game: mockIngredientDocument.game.id
      });
      component.onSubmit();

      expect(ingredientServiceSpy.update).toHaveBeenCalled();

      promise
        .catch(() => { return; })
        .finally(() => {
          expect(matSnackBarSpy.open).toHaveBeenCalled();
          expect(component.clearForm).not.toHaveBeenCalled();
          done();
        });
    });
  });
});
