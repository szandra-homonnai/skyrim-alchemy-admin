import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientListComponent } from '@app/ingredient/components/ingredient-list/ingredient-list.component';
import { EffectService } from '@app/services/effect.service';
import { IngredientService } from '@app/services/ingredient.service';
import { MockComponent } from '@app/testing/component.mock';
import { mockEffect, mockIngredientDocument } from '@app/testing/data.mock';
import { of } from 'rxjs';

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;
  let effectServiceSpy: jasmine.SpyObj<EffectService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IngredientListComponent,
        MockComponent({ selector: 'app-ingredient-form', inputs: ['editedIngredient'] })
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: IngredientService, useValue: jasmine.createSpyObj('IngredientService', ['list']) },
        { provide: EffectService, useValue: jasmine.createSpyObj('EffectService', ['list']) }
      ]
    })
      .compileComponents();

    ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
    ingredientServiceSpy.list.and.returnValue(of([mockIngredientDocument]));

    effectServiceSpy = TestBed.inject(EffectService) as jasmine.SpyObj<EffectService>;
    effectServiceSpy.list.and.returnValue(of([mockEffect]));

    fixture = TestBed.createComponent(IngredientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.searchControl).toBeTruthy();
    expect(ingredientServiceSpy.list).toHaveBeenCalledTimes(1);
    expect(component.dataSource.data).toEqual([mockIngredientDocument]);
    expect(effectServiceSpy.list).toHaveBeenCalledTimes(1);
    expect(component.effects).toEqual({ [mockEffect.id]: mockEffect });
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

    describe('#sortingDataAccessor', () => {
      it('should sort data correctly', () => {
        component.ngAfterViewInit();

        expect(component.dataSource.sortingDataAccessor(mockIngredientDocument, 'effect1')).toEqual(mockEffect.name);
        expect(component.dataSource.sortingDataAccessor(mockIngredientDocument, 'effect2')).toEqual(mockIngredientDocument.effect2.id);
        expect(component.dataSource.sortingDataAccessor(mockIngredientDocument, 'effect3')).toEqual(mockIngredientDocument.effect3.id);
        expect(component.dataSource.sortingDataAccessor(mockIngredientDocument, 'effect4')).toEqual(mockIngredientDocument.effect4.id);
        expect(component.dataSource.sortingDataAccessor(mockIngredientDocument, 'name')).toEqual(mockIngredientDocument.name);
        expect(component.dataSource.sortingDataAccessor(mockIngredientDocument, 'somehting')).toBeNull();
      });
    });
  });

  describe('#onClickAdd', () => {
    it('should set edited ingredient and scroll to the top', () => {
      component.editedIngredient = mockIngredientDocument;
      component.onClickAdd();

      expect(component.editedIngredient).toBeNull();
    });
  });

  describe('#onClickEdit', () => {
    it('should set edited ingredient and scroll to the top', () => {
      component.editedIngredient = null;
      component.onClickEdit(mockIngredientDocument);

      expect(component.editedIngredient).toEqual(mockIngredientDocument);
    });
  });
});
