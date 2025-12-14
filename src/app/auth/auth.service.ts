import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginData, RegisterData, UserData } from './auth.data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private httpClient = inject(HttpClient);

  user = signal<UserData | null>(null);
  isAuthenticated = signal<boolean>(false);

  register(data: RegisterData): Observable<UserData> {
    return this.httpClient.post<UserData>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<UserData> {
    return this.httpClient.post<UserData>(`${this.apiUrl}/login`, data);
  }

  getCurrentUser(): Observable<UserData> {
    return this.httpClient.get<UserData>(`${this.apiUrl}/me`);
  }
}
