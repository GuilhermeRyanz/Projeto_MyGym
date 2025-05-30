import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environments';
import {catchError, Observable, throwError} from 'rxjs';
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

  private getHearders(): HttpHeaders {
    const toke  = this.authService.getToken() || "";
    return new HttpHeaders({"Authorization": "Bearer " .concat(toke)});

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
      errorMessage = `Erro ${error.status}: ${error.statusText}`;
    }

    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
    });

    return throwError(errorMessage);
  }


  post(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http.post(this.baseUrl + path, body, {headers: this.getHearders()}).pipe(
      tap((response: any) => response),
      catchError((error) => this.handleError(error))
    );
  }

  get(path: string): Observable<HttpResponse<any>> {
    return this.http.get(this.baseUrl + path, {headers: this.getHearders()}).pipe(
      tap((response: any) => response),
      catchError((error) => this.handleError(error))
    );
  }

  patch(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http.patch(this.baseUrl + path + body.id + '/', body, {headers: this.getHearders()}).pipe(
      tap((response: any) => response),
      catchError((error) => this.handleError(error))
    );
  }

  delete(path: string, id: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.baseUrl + path + id + '/', {headers: this.getHearders()}).pipe(
      tap((response: any) => response),
      catchError((error) => this.handleError(error))
    );
  }

  disable(path: string, body: any, path_1: any): Observable<HttpResponse<any>> {
    return this.http.post(this.baseUrl + path + body.id + `/${path_1}/`, body, {headers: this.getHearders()}).pipe(
      tap((response: any) => response),
      catchError((error) => this.handleError(error))
    );
  }

}


