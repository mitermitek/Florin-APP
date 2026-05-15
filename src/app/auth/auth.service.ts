import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated = signal(false);

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  public me(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/me`);
  }
}
