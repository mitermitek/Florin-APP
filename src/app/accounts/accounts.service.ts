import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paginated, PaginationParams } from '../shared/pagination/pagination.data';
import { Account, AccountRequest } from './accounts.data';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  public getAccounts(paginationParams: PaginationParams): Observable<Paginated<Account>> {
    const httpParams = new HttpParams()
      .set('page', paginationParams.page.toString())
      .set('size', paginationParams.size.toString());

    return this.httpClient.get<Paginated<Account>>(this.apiUrl, { params: httpParams });
  }

  public getAccount(id: number): Observable<Account> {
    return this.httpClient.get<Account>(`${this.apiUrl}/${id}`);
  }

  public createAccount(accountRequest: AccountRequest): Observable<Account> {
    return this.httpClient.post<Account>(this.apiUrl, accountRequest);
  }

  public updateAccount(id: number, accountRequest: AccountRequest): Observable<Account> {
    return this.httpClient.put<Account>(`${this.apiUrl}/${id}`, accountRequest);
  }

  public deleteAccount(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
