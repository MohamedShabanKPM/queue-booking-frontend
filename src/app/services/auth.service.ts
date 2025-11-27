import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, LoginResponseDto, UserDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): UserDto | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin' || user?.role === 'admin';
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

