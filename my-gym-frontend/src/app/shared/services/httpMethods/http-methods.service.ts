import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environments';
import {catchError, map, Observable, of, switchMap, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../auth/services/auth.service";


@Injectable({
  providedIn: 'root',
})
export class HttpMethodsService {
  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private authService: AuthService,) {
  }

  private getHeaders(): Observable<HttpHeaders> {
    let token = this.authService.getToken() || '';
    console.log("Token atual", token);

    if (this.isTokenExpired()) {
      console.log("Token expirado, atualizando...");
      return this.authService.refreshToken().pipe(
        switchMap((newToken) => {
          return of(new HttpHeaders({ "Authorization": "Bearer ".concat(newToken) }));
        })
      );
    }

    return of(new HttpHeaders({ "Authorization": "Bearer ".concat(token) }));
  }

  public handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado.';

    if (error && error.error) {
      console.log('Erro no corpo da resposta:', error.error);
      if (error.error.detail && error.error.detail.length > 0) {
        errorMessage = `Erro: ${error.error.detail}`;
      } else if (error.error.username && error.error.username.length > 0) {
        errorMessage = `Erro no email: ${error.error.username[0]}`;
      } else {
        for (let field in error.error) {
          if (error.error.hasOwnProperty(field) && error.error[field].length > 0) {
            errorMessage = `Erro "${field}": ${error.error[field][0]}`;
            break;
          }
        }
      }
    } else if (error.status) {
      errorMessage = error.error;
    }

    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
    });

    return throwError(errorMessage);
  }
  isTokenExpired(): boolean {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('Token não encontrado. Considere-o expirado.');
      return true;
    }

    try {
      const decodedToken = this.decodedToken(token);
      const expiration = new Date(decodedToken.exp * 1000);
      return expiration < new Date();
    } catch (error) {
      return true;
    }
  }

  decodedToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      throw new Error('Token inválido ou não é um JWT válido.');
    }
  }

  post(path: string, body: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.post(this.baseUrl + path, body, { headers }).pipe(
          catchError((error) => this.handleError(error))
        )
      )
    );
  }

  get(path: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.get(this.baseUrl + path, { headers }).pipe(
          catchError((error) => this.handleError(error))
        )
      )
    );
  }
  patch(path: string, body: any): Observable<HttpResponse<any>> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.patch(this.baseUrl + path + body.id + '/', body, { headers }).pipe(
          tap((response: any) => response),
          catchError((error) => this.handleError(error))
        )
      )
    );
  }

  delete(path: string, id: number): Observable<HttpResponse<any>> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.delete(this.baseUrl + path + id + '/', { headers }).pipe(
          tap((response: any) => response),
          catchError((error) => this.handleError(error))
        )
      )
    );
  }

  disable(path: string, body: any, path_1: any): Observable<HttpResponse<any>> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.post(this.baseUrl + path + body.id + `/${path_1}/`, body, { headers }).pipe(
          tap((response: any) => response),
          catchError((error) => this.handleError(error))
        )
      )
    );
  }

}


