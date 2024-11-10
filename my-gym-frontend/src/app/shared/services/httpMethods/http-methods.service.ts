import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { catchError, from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {TokenService} from "./token-service.service";

@Injectable({
  providedIn: 'root',
})
export class HttpMethodsService {
  private baseUrl: string = environment.baseUrl;
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.tokenService.token$.subscribe((token) => {
      this.headers = new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
      });
    });
  }

  post(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http
      .post(this.baseUrl + path, body, { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError(() => from([]))
      );
  }

  get(path: string): Observable<HttpResponse<any>> {
    return this.http
      .get(this.baseUrl + path, { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError(() => from([]))
      );
  }

  patch(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http
      .patch(this.baseUrl + path + body.id + '/', body, { headers: this.headers })
      .pipe(
        tap((response: any) => response),
        catchError(() => from([]))
      );
  }

  delete(path: string, id: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.baseUrl + path + id + '/', { headers: this.headers }).pipe(
        tap((response: any) => response),
        catchError(() => from([]))
      );
  }
}
