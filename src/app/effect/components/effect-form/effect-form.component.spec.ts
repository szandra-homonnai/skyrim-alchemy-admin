import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentReference } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectFormComponent } from '@app/effect/components/effect-form/effect-form.component';
import { EffectService } from '@app/services/effect.service';
import { mockEffect } from '@app/testing/data.mock';

describe('EffectFormComponent', () => {
  let component: EffectFormComponent;
  let fixture: ComponentFixture<EffectFormComponent>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let effectServiceSpy: jasmine.SpyObj<EffectService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EffectFormComponent
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
        { provide: EffectService, useValue: jasmine.createSpyObj('EffectService', ['create', 'update']) }
      ]
    })
      .compileComponents();

    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    effectServiceSpy = TestBed.inject(EffectService) as jasmine.SpyObj<EffectService>;

    fixture = TestBed.createComponent(EffectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.schools).toBeTruthy();
    expect(component.types).toBeTruthy();
  });

  describe('#editedEffect setter - getter', () => {
    it('should set edited effect, reset form and not update form values when effect is empty', () => {
      spyOn(component, 'resetForm');
      spyOn(component.form, 'setValue');

      component.editedEffect = null;

      expect(component.editedEffect).toBeNull();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.form.setValue).not.toHaveBeenCalled();
    });

    it('should set edited effect, reset form and update form values when effect has value', () => {
      spyOn(component, 'resetForm');
      spyOn(component.form, 'setValue').and.callThrough();

      component.editedEffect = mockEffect;

      expect(component.editedEffect).toEqual(mockEffect);
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.form.setValue).toHaveBeenCalled();
      expect(component.form.value).toEqual({ name: mockEffect.name, school: mockEffect.school, type: mockEffect.type });
    });
  });

  describe('#clearForm', () => {
    it('should set edited effect to null, emit change and reset form', () => {
      spyOn(component, 'resetForm');
      spyOn(component.editedEffectChange, 'emit');
      component.editedEffect = mockEffect;

      component.clearForm();

      expect(component.editedEffect).toBeNull();
      expect(component.editedEffectChange.emit).toHaveBeenCalledWith(null);
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
      component.formGroupDirective = null;

      component.resetForm();

      expect(component.form.reset).toHaveBeenCalled();
    });
  });

  describe('#onSubmit', () => {
    it('should do nothing when form is invalid', () => {
      component.form.patchValue({ name: null });
      component.onSubmit();

      expect(effectServiceSpy.create).not.toHaveBeenCalled();
    });

    it('should handle susscessful create request', (done: DoneFn) => {
      const promise: Promise<DocumentReference> = new Promise((resolve: (value: DocumentReference) => void) => resolve(null));
      effectServiceSpy.create.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.form.setValue({ name: mockEffect.name, school: mockEffect.school, type: mockEffect.type });
      component.onSubmit();

      expect(effectServiceSpy.create).toHaveBeenCalled();

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
      effectServiceSpy.create.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.form.setValue({ name: mockEffect.name, school: mockEffect.school, type: mockEffect.type });
      component.onSubmit();

      expect(effectServiceSpy.create).toHaveBeenCalled();

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
      effectServiceSpy.update.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.editedEffect = mockEffect;
      component.form.setValue({ name: mockEffect.name, school: mockEffect.school, type: mockEffect.type });
      component.onSubmit();

      expect(effectServiceSpy.update).toHaveBeenCalled();

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
      effectServiceSpy.update.and.returnValue(promise);
      spyOn(component, 'clearForm');
      component.editedEffect = mockEffect;
      component.form.setValue({ name: mockEffect.name, school: mockEffect.school, type: mockEffect.type });
      component.onSubmit();

      expect(effectServiceSpy.update).toHaveBeenCalled();

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
