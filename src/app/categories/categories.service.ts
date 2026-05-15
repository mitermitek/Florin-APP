import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paginated, PaginationParams } from '../shared/pagination/pagination.data';
import { Category } from './categories.data';
import { CategoryRequest } from './category-form/category-form.data';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  public getCategories(paginationParams: PaginationParams): Observable<Paginated<Category>> {
    const httpParams = new HttpParams()
      .set('page', paginationParams.page.toString())
      .set('size', paginationParams.size.toString());

    return this.httpClient.get<Paginated<Category>>(this.apiUrl, { params: httpParams });
  }

  public getCategory(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.apiUrl}/${id}`);
  }

  public createCategory(categoryRequest: CategoryRequest): Observable<Category> {
    return this.httpClient.post<Category>(this.apiUrl, categoryRequest);
  }

  public updateCategory(id: number, categoryRequest: CategoryRequest): Observable<Category> {
    return this.httpClient.put<Category>(`${this.apiUrl}/${id}`, categoryRequest);
  }

  public deleteCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
