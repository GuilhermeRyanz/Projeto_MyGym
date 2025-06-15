import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpMethodsService } from './http-methods.service';
import { environment } from "../../../environments/environments";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  showBannerEmmiter = new EventEmitter<boolean>();
  userUpdateEmitter = new EventEmitter<void>();
  private pathUrl: string = environment.baseUrl;
  navVisibilityEmitter = new EventEmitter<boolean>();


  constructor(
    private http: HttpClient,
    private router: Router,
    private httpMethods: HttpMethodsService
  ) {}

  public login(payload: { username: string; password: string }) {
    const headers = { 'Content-Type': 'application/json' };
    const apiUrl = this.pathUrl + 'api/token/';

    return this.http.post(apiUrl, payload, { headers }).pipe(
      tap((response: any) => {
        this.setToken(response.access_token, response.refresh_token);
        localStorage.setItem('tipo_usuario', response.tipo_usuario);
        localStorage.setItem('email', response.email);
        localStorage.setItem('nome_usuario', response.name);

        if (response.academia) {
          localStorage.setItem('academia', response.academia);
          localStorage.setItem('academia_nome', response.academia_nome);
        }

        this.showBannerEmmiter.emit(true);
        this.userUpdateEmitter.emit();

        const tipoUsuario = response.tipo_usuario;
        if (tipoUsuario === 'D') {
          this.router.navigate(['/adm/gym/list/']);
        } else if (tipoUsuario === 'A' || tipoUsuario === 'G') {
          this.router.navigate(['/my_gym/home/']);
        }
      }),
      catchError((error: any) => this.httpMethods.handleError(error))
    );
  }

  public loginMember(payload: { username: string; password: string }) {
    const headers = { 'Content-Type': 'application/json' };
    const apiUrl = this.pathUrl + 'api/aluno/token/';

    return this.http.post(apiUrl, payload, { headers }).pipe(
      tap((response: any) => {
        this.setToken(response.access_token, response.refresh_token);
        localStorage.setItem('tipo_usuario', response.tipo_usuario);
        localStorage.setItem('nome_usuario', response.name)

        this.showBannerEmmiter.emit(true);
        this.userUpdateEmitter.emit();

        this.router.navigate(['MemberArea/main/']);
      }),
      catchError((error: any) => this.httpMethods.handleError(error))
    );
  }

  public get_gym(): string | null {
    return localStorage.getItem('academia');
  }

  private getTypeUser(): string | null {
    return localStorage.getItem('tipo_usuario');
  }

  public refreshToken(): Observable<string> {
    const refreshToken = this.getTokenRefresh();
    if (!refreshToken) {
      return throwError(() => new Error('Erro nas credenciais do usuário'));
    }

    const apiUrl = this.pathUrl + 'api/token/refresh/';
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post<any>(apiUrl, { refresh: refreshToken }, { headers }).pipe(
      map((response) => {
        this.setToken(response.access, response.refresh);
        return response.access;
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public setToken(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public getTokenRefresh(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private decodeToken(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  public isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  }

  public userIsAuth(): boolean {
    return this.isTokenValid();
  }

  public userIsAuthGy(): boolean {
    return !!localStorage.getItem('academia');
  }

  public logout() {
    this.navVisibilityEmitter.emit(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('academia');
    localStorage.removeItem('academia_nome');
    localStorage.removeItem('email');
    localStorage.removeItem('nome_usuario');
    localStorage.removeItem('matricula');
    this.router.navigate(['/auth/login']).then();
  }

  public checkAuthAndRedirect(): void {
    if (!this.isTokenValid()) {
      this.logout();
    }
  }
}
