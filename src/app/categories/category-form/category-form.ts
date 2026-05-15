import { Component, computed, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Category } from '../categories.data';
import { CategoriesService } from '../categories.service';
import { CategoryForm as CategoryFormData, CategoryRequest } from './category-form.data';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  readonly category = input<Category>();
  readonly formId = input<string>('category-form');
  readonly saved = output<Category | undefined>();

  private readonly categoriesService = inject(CategoriesService);

  readonly categoryForm = computed(
    () =>
      new FormGroup<CategoryFormData>({
        name: new FormControl<string>(this.category()?.name ?? '', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }),
      }),
  );

  protected saveCategory(): void {
    if (this.categoryForm().invalid) {
      this.categoryForm().markAllAsTouched();
      return;
    }

    const formValues = this.categoryForm().getRawValue();
    const categoryRequest: CategoryRequest = {
      name: formValues.name,
    };

    let observable$: Observable<Category>;
    if (this.category()) {
      observable$ = this.categoriesService.updateCategory(this.category()!.id, categoryRequest);
    } else {
      observable$ = this.categoriesService.createCategory(categoryRequest);
    }

    observable$.pipe(take(1)).subscribe({
      next: (category) => {
        this.saved.emit(category);
      },
      error: (error) => {
        this.saved.emit(undefined);
      },
    });
  }
}
