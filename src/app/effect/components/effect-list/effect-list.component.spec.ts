import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectListComponent } from '@app/effect/components/effect-list/effect-list.component';
import { EffectService } from '@app/services/effect.service';
import { IngredientService } from '@app/services/ingredient.service';
import { MockComponent } from '@app/testing/component.mock';
import { mockEffect, mockIngredientDocument } from '@app/testing/data.mock';
import { of } from 'rxjs';

describe('EffectListComponent', () => {
  let component: EffectListComponent;
  let fixture: ComponentFixture<EffectListComponent>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;
  let effectServiceSpy: jasmine.SpyObj<EffectService>;

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
        { provide: EffectService, useValue: jasmine.createSpyObj('EffectService', ['list']) },
        { provide: IngredientService, useValue: jasmine.createSpyObj('IngredientService', ['getNameMapByEffectIds']) }
      ]
    })
      .compileComponents();

    effectServiceSpy = TestBed.inject(EffectService) as jasmine.SpyObj<EffectService>;
    effectServiceSpy.list.and.returnValue(of([mockEffect]));

    ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
    ingredientServiceSpy.getNameMapByEffectIds.and.returnValue(of(mockIngredientMap));

    fixture = TestBed.createComponent(EffectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.searchControl).toBeTruthy();
    expect(effectServiceSpy.list).toHaveBeenCalledTimes(1);
    expect(component.dataSource.data).toEqual([mockEffect]);
    expect(ingredientServiceSpy.getNameMapByEffectIds).toHaveBeenCalledTimes(1);
    expect(component.ingredients).toEqual(mockIngredientMap);
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
});
