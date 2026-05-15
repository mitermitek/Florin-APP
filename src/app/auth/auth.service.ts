import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.data';
import { LoginRequest } from './login/login.data';
import { RegisterRequest } from './register/register.data';

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

  public register(registerRequest: RegisterRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/register`, registerRequest);
  }

  public login(loginRequest: LoginRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/login`, loginRequest);
  }

  public logout(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/logout`, {});
  }
}
