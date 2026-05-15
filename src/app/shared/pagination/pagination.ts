import { Component, computed, effect, input, model } from '@angular/core';
import { PaginationParams } from './pagination.data';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  public readonly paginationParams = model.required<PaginationParams>();
  public readonly total = input.required<number>();

  private readonly effectivePageSize = computed(() => Math.max(1, this.paginationParams().size));

  protected readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(Math.max(0, this.total()) / this.effectivePageSize()));
  });

  protected readonly currentPage = computed(() => {
    return Math.min(Math.max(1, this.paginationParams().page), this.totalPages());
  });

  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  constructor() {
    effect(() => {
      const currentPage = this.paginationParams().page;
      const totalPages = this.totalPages();

      if (currentPage > totalPages) {
        this.paginationParams.update((params) => ({
          ...params,
          page: totalPages,
        }));
      }
    });
  }

  protected changePage(pageNumber: number): void {
    if (pageNumber === this.currentPage()) {
      return;
    }

    if (pageNumber < 1 || pageNumber > this.totalPages()) {
      return;
    }

    this.paginationParams.update((params) => {
      return {
        ...params,
        page: pageNumber,
      };
    });
  }
}
