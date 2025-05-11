import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { usersMock } from '../mock-data/mocks';  // agora todos os mocks vêm do mesmo arquivo
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface LoginResponse {
  token: string;
  user: User;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  loginDummy(email: string, password: string): Observable<User> {
    const user = usersMock.find(u => u.email === email);
    if (!user) {
      return throwError(() => new Error('Credenciais inválidas. Por favor, tente novamente.'));
    }

    return of(user).pipe(
      delay(800),
      tap(u => {
        localStorage.setItem('auth_token', 'mock_jwt_token');
        localStorage.setItem('currentUser', JSON.stringify(u));
        this.currentUserSubject.next(u);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.authApiUrl}`,
      { username, password }
    );
  }

  registerDummy(userData: Partial<User>): Observable<User> {
    const newUser: User = {
      id: usersMock.length + 1,
      username: userData.username ?? '',
      email: userData.email ?? '',
      fullName: userData.fullName ?? '',
      avatar: userData.avatar ?? 'https://images.unsplash.com/photo-1630910561339-4e22c7150093',
      reputationLevel: 1,
      reputationScore: 0,
      createdAt: new Date(),
      products: [],        // Interface agora espera Product[]
      bio: userData.bio ?? '',
      location: userData.location ?? '',
      phone: userData.phone ?? ''
    };

    return of(newUser).pipe(
      delay(1000),
      tap(u => {
        localStorage.setItem('auth_token', 'mock_jwt_token');
        localStorage.setItem('currentUser', JSON.stringify(u));
        this.currentUserSubject.next(u);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(data: FormData): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/users/`,
      data
    );
  }
}
