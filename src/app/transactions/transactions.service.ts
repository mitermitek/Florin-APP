import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paginated, PaginationParams } from '../shared/pagination/pagination.data';
import { Transaction, TransactionRequest } from './transactions.data';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = `${environment.apiUrl}/accounts`;

  public getTransactions(
    accountId: number,
    paginationParams: PaginationParams,
  ): Observable<Paginated<Transaction>> {
    const httpParams = new HttpParams()
      .set('page', paginationParams.page.toString())
      .set('size', paginationParams.size.toString());

    return this.httpClient.get<Paginated<Transaction>>(
      `${this.apiBaseUrl}/${accountId}/transactions`,
      { params: httpParams },
    );
  }

  public getTransaction(accountId: number, transactionId: number): Observable<Transaction> {
    return this.httpClient.get<Transaction>(
      `${this.apiBaseUrl}/${accountId}/transactions/${transactionId}`,
    );
  }

  public createTransaction(
    accountId: number,
    transactionRequest: TransactionRequest,
  ): Observable<Transaction> {
    return this.httpClient.post<Transaction>(
      `${this.apiBaseUrl}/${accountId}/transactions`,
      transactionRequest,
    );
  }

  public updateTransaction(
    accountId: number,
    transactionId: number,
    transactionRequest: TransactionRequest,
  ): Observable<Transaction> {
    return this.httpClient.put<Transaction>(
      `${this.apiBaseUrl}/${accountId}/transactions/${transactionId}`,
      transactionRequest,
    );
  }

  public deleteTransaction(accountId: number, transactionId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiBaseUrl}/${accountId}/transactions/${transactionId}`,
    );
  }
}
