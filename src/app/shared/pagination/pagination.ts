import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageChange = output<number>();

  protected totalPages = computed(() => {
    return Math.ceil(this.totalItems() / 10);
  });

  protected pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = 3;

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const halfMax = Math.floor(max / 2);
    let start = Math.max(1, current - halfMax);
    const end = Math.min(total, start + max - 1);

    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  protected changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
