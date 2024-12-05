import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../environments/environments";


@Injectable({
  providedIn: 'root',
})
export class HttpMethodsService {
  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient,
              private snackBar: MatSnackBar){}

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
    return this.http.post(this.baseUrl + path, body,).pipe(
      tap((response: any) => response),
      catchError((error) => this.handleError(error))
    );
  }


}



