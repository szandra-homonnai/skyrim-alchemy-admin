import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectListComponent } from '@app/effect/components/effect-list/effect-list.component';
import { listEffects } from '@app/effect/state/effect.actions';
import { EffectState } from '@app/effect/state/effect.reducer';
import { selectEffectsAreLoaded, selectEffectsList } from '@app/effect/state/effect.selectors';
import { Effect } from '@app/interfaces/effect.interface';
import { EffectService } from '@app/services/effect.service';
import { IngredientService } from '@app/services/ingredient.service';
import { MockComponent } from '@app/testing/component.mock';
import { mockEffect, mockIngredientDocument } from '@app/testing/data.mock';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('EffectListComponent', () => {
  let component: EffectListComponent;
  let fixture: ComponentFixture<EffectListComponent>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;
  let effectServiceSpy: jasmine.SpyObj<EffectService>;
  let store: MockStore;

  const initialEffectState: EffectState = { effectsAreLoaded: true, effects: [mockEffect] };

  const mockIngredientMap: Map<string, string[]> = new Map();
  mockIngredientMap.set(mockEffect.id, [mockIngredientDocument.name]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EffectListComponent,
        MockComponent({ selector: 'app-effect-form', inputs: ['editedEffect'] })
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule
      ],
      providers: [
        provideMockStore({ initialState: { effect: initialEffectState } }),
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: EffectService, useValue: jasmine.createSpyObj('EffectService', ['delete']) },
        { provide: IngredientService, useValue: jasmine.createSpyObj('IngredientService', ['getNameMapByEffectIds']) }
      ]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);

    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    effectServiceSpy = TestBed.inject(EffectService) as jasmine.SpyObj<EffectService>;

    ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
    ingredientServiceSpy.getNameMapByEffectIds.and.returnValue(of(mockIngredientMap));

    fixture = TestBed.createComponent(EffectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', (done: DoneFn) => {
    expect(component).toBeTruthy();
    expect(component.searchControl).toBeTruthy();
    expect(component.dataSource.data).toEqual([mockEffect]);
    expect(ingredientServiceSpy.getNameMapByEffectIds).toHaveBeenCalledTimes(1);
    expect(component.ingredients).toEqual(mockIngredientMap);

    store.scannedActions$.subscribe((action: Action) => {
      expect(action).not.toEqual(listEffects());
      done();
    });
  });

  it('should dispatch store action when effects are not loaded', (done: DoneFn) => {
    store.overrideSelector(selectEffectsAreLoaded, false);
    store.refreshState();

    store.scannedActions$.subscribe((action: Action) => {
      expect(action).toEqual(listEffects());
      done();
    });
  });

  it('should set datasource when store selector changes', () => {
    store.overrideSelector(selectEffectsList, []);
    store.refreshState();
    expect(component.dataSource.data).toEqual([]);
  });

  describe('#searchControl', () => {
    it('should set data source filter whe value cahnges', () => {
      const searchText: string = 'something';
      component.searchControl.setValue(searchText);

      expect(component.dataSource.filter).toEqual(searchText);
    });
  });

  describe('#ngAfterViewInit', () => {
    it('should set sorting attributes', () => {
      component.ngAfterViewInit();

      expect(component.dataSource.sort).toEqual(component.sort);
      expect(component.dataSource.sortingDataAccessor).toBeTruthy();
    });
  });

  describe('#onClickAdd', () => {
    it('should set edited effect', () => {
      component.editedEffect = mockEffect;
      component.onClickAdd();

      expect(component.editedEffect).toBeNull();
    });
  });

  describe('#onClickEdit', () => {
    it('should set edited effect', () => {
      component.editedEffect = null;
      component.onClickEdit(mockEffect);

      expect(component.editedEffect).toEqual(mockEffect);
    });
  });

  describe('#onClickDelete', () => {
    it('should open confirm dialog and handle not deletable effect', () => {
      component.onClickDelete(mockEffect);

      expect(matSnackBarSpy.open).toHaveBeenCalled();
      expect(matDialogSpy.open).not.toHaveBeenCalled();
      expect(effectServiceSpy.delete).not.toHaveBeenCalled();
    });

    it('should open confirm dialog and handle not confirmed delete', () => {
      const dialogRef: MatDialogRef<unknown, boolean> = { afterClosed: () => of(false) } as MatDialogRef<unknown, boolean>;
      matDialogSpy.open.and.returnValue(dialogRef);

      component.onClickDelete({ ...mockEffect, id: 'id' });

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(effectServiceSpy.delete).not.toHaveBeenCalled();
    });

    it('should open confirm dialog and handle confirmed and successful delete', (done: DoneFn) => {
      const dialogRef: MatDialogRef<unknown, boolean> = { afterClosed: () => of(true) } as MatDialogRef<unknown, boolean>;
      matDialogSpy.open.and.returnValue(dialogRef);
      const promise: Promise<void> = new Promise((resolve: (value: void) => void) => resolve());
      effectServiceSpy.delete.and.returnValue(promise);
      const effect: Effect = { ...mockEffect, id: 'id' };

      component.onClickDelete(effect);

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(effectServiceSpy.delete).toHaveBeenCalledWith(effect.id);

      promise
        .then(() => { return; })
        .finally(() => {
          expect(matSnackBarSpy.open).toHaveBeenCalled();
          done();
        });
    });

    it('should open confirm dialog and handle confirmed and failed delete', (done: DoneFn) => {
      const dialogRef: MatDialogRef<unknown, boolean> = { afterClosed: () => of(true) } as MatDialogRef<unknown, boolean>;
      matDialogSpy.open.and.returnValue(dialogRef);
      const promise: Promise<void> = new Promise(
        (resolve: (value: void) => void, reject: (reason: string) => void) => reject('Error!')
      );
      effectServiceSpy.delete.and.returnValue(promise);
      const effect: Effect = { ...mockEffect, id: 'id' };

      component.onClickDelete(effect);

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(effectServiceSpy.delete).toHaveBeenCalledWith(effect.id);

      promise
        .catch(() => { return; })
        .finally(() => {
          expect(matSnackBarSpy.open).toHaveBeenCalled();
          done();
        });
    });
  });
});
