import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paginated, PaginationParams } from '../shared/pagination/pagination.data';
import { Category, CategoryRequest } from './categories.data';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  public getCategories(params: PaginationParams): Observable<Paginated<Category>> {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    return this.httpClient.get<Paginated<Category>>(this.apiUrl, { params: httpParams });
  }

  public getCategory(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.apiUrl}/${id}`);
  }

  public createCategory(request: CategoryRequest): Observable<Category> {
    return this.httpClient.post<Category>(this.apiUrl, request);
  }

  public updateCategory(id: number, request: CategoryRequest): Observable<Category> {
    return this.httpClient.put<Category>(`${this.apiUrl}/${id}`, request);
  }

  public deleteCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
