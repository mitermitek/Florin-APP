import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { catchError, EMPTY, take } from 'rxjs';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Category } from '../categories.data';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-category-deletion-dialog',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './category-deletion-dialog.html',
})
export class CategoryDeletionDialog {
  public data = inject<Category>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<CategoryDeletionDialog>);
  private readonly categoriesService = inject(CategoriesService);
  private readonly snackbarService = inject(SnackbarService);

  protected confirm(): void {
    this.categoriesService
      .deleteCategory(this.data.id)
      .pipe(
        take(1),
        catchError(() => {
          this.snackbarService.error(
            'An error occurred while deleting the category. Please try again later.',
          );
          return EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
  }
}
