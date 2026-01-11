import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { switchMap } from 'rxjs';
import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGINATION_PARAMS,
} from '../shared/pagination/pagination.data';
import { Category } from './categories.data';
import { CategoriesService } from './categories.service';
import { CategoryDeletionDialog } from './category-deletion-dialog/category-deletion-dialog';
import { CategoryFormDialog } from './category-form-dialog/category-form-dialog';

@Component({
  selector: 'app-categories',
  imports: [MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './categories.html',
})
export class Categories {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly categoriesService = inject(CategoriesService);

  protected columns = signal(['id', 'name', 'actions']);
  protected pageSizeOptions = signal(DEFAULT_PAGE_SIZE_OPTIONS);
  protected paginationParams = signal(DEFAULT_PAGINATION_PARAMS);

  protected paginatedCategories = toSignal(
    toObservable(this.paginationParams).pipe(
      switchMap((params) => this.categoriesService.getCategories(params)),
    ),
  );

  protected onPageChange(pageEvent: PageEvent): void {
    this.paginationParams.set({
      page: pageEvent.pageIndex + 1,
      size: pageEvent.pageSize,
    });
  }

  protected openFormDialog(category?: Category): void {
    this.dialog
      .open(CategoryFormDialog, {
        data: category,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success?: boolean) => {
        if (success) {
          const currentParams = this.paginationParams();
          this.paginationParams.set({ ...currentParams });
        }
      });
  }

  protected openDeletionDialog(category: Category): void {
    this.dialog
      .open(CategoryDeletionDialog, {
        data: category,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success?: boolean) => {
        if (success) {
          const currentParams = this.paginationParams();
          this.paginationParams.set({ ...currentParams });
        }
      });
  }
}
