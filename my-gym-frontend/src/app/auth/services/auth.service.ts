import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Credentials} from '../interfaces/credentials';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpMethodsService} from "./http-methods.service";
import {environment} from "../../../environments/environments";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  showBannerEmmiter = new EventEmitter<boolean>();
  userUpdateEmitter = new EventEmitter<void>();
  private pathUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router, private httpMethods: HttpMethodsService) {
  }

  login(payload: Credentials) {
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
          this.router.navigate([`/my_gym/home/`]);

        }
      }),
      catchError((error: any ) => this.httpMethods.handleError(error))
    );
  }

  public get_gym(): string | null {
    return localStorage.getItem("academia");
  }


  private getTypeUser() {
    return localStorage.getItem("tipo_usuario");
  }


  public refreshToken(): Observable<string> {
    const refreshToken = this.getTokenRefresh();
    if (!refreshToken) {
      return throwError('Erro nas credenciais do usuário');
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
        return throwError(error);
      })
    );
  }

  public setToken(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  public getToken(): string|null {
    return localStorage.getItem("access_token");
  }

  public getTokenRefresh(): string|null {
    return localStorage.getItem("refresh_token");
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('academia');
    localStorage.removeItem('user_id');
    localStorage.removeItem('nome_usuario');
    localStorage.removeItem('email');
    this.router.navigate(['/auth/login']).then();
  }

  userIsAuth(): boolean {
    return !!localStorage.getItem('access_token');
  }

  userIsAuthGy(): boolean {
    return !!localStorage.getItem('academia');
  }
}
