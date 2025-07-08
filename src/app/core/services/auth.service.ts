import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

export interface Estado { id: number; nome: string; sigla: string; }
export interface Cidade { id: number; nome: string; }

export interface LoginResponse {
  token: string;
  user: User;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private locationUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.http = new HttpClient(this.handler);
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

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.authApiUrl}`,
      { username, password }
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

  updateUser(data: FormData, id: number): Observable<User> {
    return this.http.patch<User>(
      `${environment.apiUrl}/users/${id}/`,
      data
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(
      `${environment.apiUrl}/users/${id}/`
    );
  }

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.locationUrl)
      .pipe(map(estados => estados.sort((a, b) => a.nome.localeCompare(b.nome))));
  }

  getCidades(estadoId: number): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`${this.locationUrl}/${estadoId}/municipios`)
      .pipe(map(cidades => cidades.sort((a, b) => a.nome.localeCompare(b.nome))));
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }
}
