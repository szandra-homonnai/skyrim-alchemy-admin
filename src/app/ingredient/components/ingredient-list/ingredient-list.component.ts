import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Effect } from '@app/interfaces/effect.interface';
import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import { EffectService } from '@app/services/effect.service';
import { IngredientService } from '@app/services/ingredient.service';
import { scrollToTop } from '@app/style/style-helper';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnDestroy, AfterViewInit {
  private unsubsribe: Subject<boolean> = new Subject();

  public displayedColumns: string[] = ['name', 'effect1', 'effect2', 'effect3', 'effect4', 'action'];
  public dataSource: MatTableDataSource<IngredientDocument> = new MatTableDataSource();
  public effects: { [key: string]: Effect } = {};

  public editedIngredient: IngredientDocument;

  public searchControl: FormControl<string>;

  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  constructor(
    private ingredientService: IngredientService,
    private effectService: EffectService
  ) {
    this.searchControl = new FormControl('');

    this.searchControl.valueChanges
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((value: string) => {
        this.dataSource.filter = value.trim().toLowerCase();
      });

    this.ingredientService.list()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: IngredientDocument[]) => this.dataSource.data = items);

    this.effectService.list()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: Effect[]) => {
        for (const item of items) {
          this.effects[item.id] = item;
        }
      });
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (data: IngredientDocument, column: string) => {
      switch (column) {
        case 'effect1':
        case 'effect2':
        case 'effect3':
        case 'effect4': {
          const effectId: string = data[column]?.id || null;
          return effectId && this.effects && this.effects[effectId] ? this.effects[effectId].name : effectId;
        }
        case 'name':
          return data[column];
        default:
          return null;
      }
    };
  }

  public ngOnDestroy(): void {
    this.unsubsribe.next(false);
    this.unsubsribe.complete();
  }

  public onClickAdd(): void {
    this.editedIngredient = null;
    scrollToTop();
  }

  public onClickEdit(ingredient: IngredientDocument): void {
    this.editedIngredient = ingredient;
    scrollToTop();
  }
}
