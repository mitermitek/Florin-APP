import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationData, PaginationFiltersData } from '../shared/pagination/pagination.data';
import { AccountData, CreateAccountData } from './account.data';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private apiUrl = `${environment.apiUrl}/accounts`;
  private httpClient = inject(HttpClient);

  getAccounts(paginationFilters: PaginationFiltersData): Observable<PaginationData<AccountData>> {
    const params = new HttpParams()
      .set('page', paginationFilters.page.toString())
      .set('size', paginationFilters.size.toString());

    return this.httpClient.get<PaginationData<AccountData>>(this.apiUrl, { params });
  }

  createAccount(data: CreateAccountData): Observable<AccountData> {
    return this.httpClient.post<AccountData>(this.apiUrl, data);
  }

  updateAccount(id: number, data: CreateAccountData): Observable<AccountData> {
    return this.httpClient.put<AccountData>(`${this.apiUrl}/${id}`, data);
  }

  deleteAccount(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
