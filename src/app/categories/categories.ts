import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { Dialog } from '../shared/dialog/dialog';
import { Pagination } from '../shared/pagination/pagination';
import { DEFAULT_PAGINATION_PARAMS } from '../shared/pagination/pagination.data';
import { Category } from './categories.data';
import { CategoriesService } from './categories.service';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-categories',
  imports: [CategoryForm, Dialog, Pagination],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private readonly categoriesService = inject(CategoriesService);

  protected displayCategoryForm = signal(false);
  protected displayCategoryDeleteConfirmation = signal(false);
  protected selectedCategory = signal<Category | undefined>(undefined);

  protected categoryFormTitle = computed(() => {
    const category = this.selectedCategory();

    if (category === undefined) {
      return 'Créer une catégorie';
    }

    return `Modifier la catégorie « ${category.name} »`;
  });

  protected paginationParams = signal(DEFAULT_PAGINATION_PARAMS);
  protected paginatedCategories = toSignal(
    toObservable(this.paginationParams).pipe(
      catchError(() => {
        return EMPTY;
      }),
      switchMap((params) => this.categoriesService.getCategories(params)),
    ),
  );

  protected openCreateCategory(): void {
    this.displayCategoryForm.set(true);
  }

  protected openUpdateCategory(categoryId: number): void {
    this.loadCategory(categoryId, (category) => {
      this.selectedCategory.set(category);
      this.displayCategoryForm.set(true);
    });
  }

  protected closeCategoryForm(): void {
    this.displayCategoryForm.set(false);
    this.selectedCategory.set(undefined);
  }

  protected handleCategorySaved(category: Category | undefined): void {
    if (!category) {
      return;
    }

    this.closeCategoryForm();
    this.paginationParams.update((params) => ({ ...params }));
  }

  protected openDeleteCategory(categoryId: number): void {
    this.loadCategory(categoryId, (category) => {
      this.selectedCategory.set(category);
      this.displayCategoryDeleteConfirmation.set(true);
    });
  }

  protected closeDeleteCategory(): void {
    this.displayCategoryDeleteConfirmation.set(false);
    this.selectedCategory.set(undefined);
  }

  protected handleCategoryDelete(): void {
    const category = this.selectedCategory();
    if (!category) {
      return;
    }

    this.categoriesService
      .deleteCategory(category.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.closeDeleteCategory();
          this.paginationParams.update((params) => ({ ...params }));
        },
      });
  }

  private loadCategory(categoryId: number, onNext: (category: Category) => void): void {
    this.categoriesService.getCategory(categoryId).pipe(take(1)).subscribe({
      next: onNext,
    });
  }
}
