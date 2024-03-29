import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { listEffects } from '@app/effect/state/effect.actions';
import { selectEffectsAreLoaded, selectEffectsList } from '@app/effect/state/effect.selectors';
import { Effect } from '@app/interfaces/effect.interface';
import { IngredientDocument } from '@app/interfaces/ingredient.interface';
import { IngredientService } from '@app/services/ingredient.service';
import { ConfirmDialogData } from '@app/shared/components/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { scrollToTop } from '@app/style/style-helper';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';

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

  public linkedIngredientName: string;

  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  constructor(
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private ingredientService: IngredientService,
    private store: Store
  ) {
    this.searchControl = new FormControl('');
    this.linkedIngredientName = location.hash.replace('#', '');

    this.searchControl.valueChanges
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((value: string) => {
        this.dataSource.filter = value.trim().toLowerCase();
      });

    this.ingredientService.list()
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((items: IngredientDocument[]) => this.dataSource.data = items);

    this.store.select(selectEffectsAreLoaded)
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((loaded: boolean) => {
        if (!loaded) {
          this.store.dispatch(listEffects());
        }
      });

    this.store.select(selectEffectsList)
      .pipe(takeUntil(this.unsubsribe))
      .subscribe((effects: Effect[]) => {
        for (const effect of effects) {
          this.effects[effect.id] = effect;
        }
      });
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (data: IngredientDocument, column: string): string => {
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

    setTimeout(() => {
      const element: HTMLElement = this.linkedIngredientName ? document.getElementById(this.linkedIngredientName) : null;
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
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

  public onClickDelete(ingredient: IngredientDocument): void {
    const data: ConfirmDialogData = {
      title: 'Confirm',
      message: `Are you sure you want to delete this ingredient: ${ingredient.name}?`
    };

    const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> = this.matDialog.open(ConfirmDialogComponent, {
      data: data
    });

    dialogRef.afterClosed()
      .pipe(
        take(1)
      )
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.ingredientService.delete(ingredient.id)
            .then(() => this.matSnackBar.open('Ingredient was successfully deleted!', null, {
              panelClass: ['my-snack-bar-bg', 'bg-primary']
            }))
            .catch(() => this.matSnackBar.open(`Ingredient couldn't be deleted!`, null, { panelClass: ['my-snack-bar-bg', 'bg-danger'] }));
        }
      });
  }

  public onClickEffect(effectId: string): void {
    this.router.navigateByUrl(`/effects#${effectId}`);
  }
}
