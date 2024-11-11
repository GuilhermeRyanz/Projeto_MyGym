import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import {catchError, from, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import {TokenService} from "./token-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
  providedIn: 'root',
})
export class HttpMethodsService {
  private baseUrl: string = environment.baseUrl;
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private snackBar: MatSnackBar) {

    this.tokenService.token$.subscribe((token) => {
      this.headers = new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
      });
    });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado.';

    if (error && error.error) {
      for (let field in error.error) {
        if (error.error.hasOwnProperty(field) && error.error[field].length > 0) {
          errorMessage = error.error[field][0];
          break;
        }
      }
    }

    else if (error.status) {
      errorMessage = `Erro ${error.status}: ${error.statusText}`;
    }

    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
    });

    console.error('Erro HTTP:', error);

    return throwError(errorMessage);
  }


  post(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http
      .post(this.baseUrl + path, body, { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError((error) => this.handleError(error))  // Usando o handleError


      );
  }

  get(path: string): Observable<HttpResponse<any>> {
    return this.http
      .get(this.baseUrl + path, { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError((error) => this.handleError(error))  // Usando o handleError

      );
  }

  patch(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http
      .patch(this.baseUrl + path + body.id + '/', body, { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError((error) => this.handleError(error))  // Usando o handleError

      );
  }

  delete(path: string, id: number): Observable<HttpResponse<any>> {
    return this.http
      .delete(this.baseUrl + path + id + '/', { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError((error) => this.handleError(error))  // Usando o handleError
      );
  }
}


