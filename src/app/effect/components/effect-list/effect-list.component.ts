import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Effect } from '@app/interfaces/effect.interface';
import { EffectService } from '@app/services/effect.service';
import { IngredientService } from '@app/services/ingredient.service';
import { scrollToTop } from '@app/style/style-helper';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-effect-list',
  templateUrl: './effect-list.component.html',
  styleUrls: ['./effect-list.component.scss'],
  animations: [
    trigger('expandDetails', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class EffectListComponent implements AfterViewInit, OnDestroy {
  private unsubsribe: Subject<boolean> = new Subject();
  public displayedColumns: string[] = ['name', 'school', 'type', 'action'];
  public dataSource: MatTableDataSource<Effect> = new MatTableDataSource();

  public ingredients: Map<string, string[]>;

  public editedEffect: Effect;
  public expandedEffect: Effect;

  public searchControl: FormControl<string>;

  @ViewChild(MatSort) public sort: MatSort;

  constructor(
    private effectService: EffectService,
    private ingredientService: IngredientService
  ) {
    this.searchControl = new FormControl('');

    this.searchControl.valueChanges
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((value: string) => {
        this.dataSource.filter = value.trim().toLowerCase();
      });

    this.effectService.list()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: Effect[]) => this.dataSource.data = items);

    this.ingredientService.getNameMapByEffectIds()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: Map<string, string[]>) => this.ingredients = items);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.unsubsribe.next(false);
    this.unsubsribe.complete();
  }

  public onClickAdd(): void {
    this.editedEffect = null;
    scrollToTop();
  }

  public onClickEdit(effect: Effect): void {
    this.editedEffect = effect;
    scrollToTop();
  }
}
