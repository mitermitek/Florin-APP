import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, User } from './auth.data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated = false;

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  public me(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/me`);
  }

  public register(request: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/register`, request);
  }

  public login(request: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/login`, request);
  }
}
