import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Effect } from '@app/interfaces/effect.interface';
import { EffectService } from '@app/services/effect.service';
import { IngredientService } from '@app/services/ingredient.service';
import { ConfirmDialogData } from '@app/shared/components/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { scrollToTop } from '@app/style/style-helper';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-effect-list',
  templateUrl: './effect-list.component.html',
  styleUrls: ['./effect-list.component.scss'],
  animations: [
    trigger('expandDetails', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
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
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
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

  public onClickDelete(effect: Effect): void {
    if (this.ingredients.has(effect.id) && this.ingredients.get(effect.id).length > 0) {
      this.matSnackBar.open(`You cannot delete this effect, because some ingredients are using this!`, null, {
        panelClass: ['my-snack-bar-bg', 'bg-danger']
      });
      return;
    }

    const data: ConfirmDialogData = {
      title: 'Confirm',
      message: `Are you sure you want to delete this effect: ${effect.name}?`
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
          this.effectService.delete(effect.id)
            .then(() => this.matSnackBar.open('Ingredient was successfully deleted!', null, {
              panelClass: ['my-snack-bar-bg', 'bg-primary']
            }))
            .catch(() => this.matSnackBar.open(`Ingredient couldn't be deleted!`, null, { panelClass: ['my-snack-bar-bg', 'bg-danger'] }));
        }
      });
  }
}
