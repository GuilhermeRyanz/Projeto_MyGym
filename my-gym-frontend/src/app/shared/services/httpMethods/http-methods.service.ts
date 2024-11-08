import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpUserEvent} from "@angular/common/http";
import {environment} from "../../../../environments/environments";
import {catchError, from, Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpMethodsService {

  private baseUrl: string;
  private readonly tokenKey: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
    this.tokenKey = <string>localStorage.getItem('accessToken');
    this.headers = new HttpHeaders({"Authorization": "Bearer ".concat(this.tokenKey)});
  }

  post(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http.post(this.baseUrl + path, body, {headers: this.headers}).pipe(
      tap((response: any) => response as HttpUserEvent<any>),
      catchError(() => from([]))
    );
  }

  get (path: string): Observable<HttpResponse<any>> {
    return this.http.get(this.baseUrl + path, {headers: this.headers}).pipe(
      tap((response: any) => response as HttpUserEvent<any>),
      catchError(() => from([]))
    );
  }

  patch(path: string, body: any): Observable<HttpResponse<any>> {
    return this.http.patch(this.baseUrl + path + body.id + '/', {headers: this.headers}).pipe(
      tap((response: any) => response as HttpUserEvent<any>),
      catchError(() => from([]))
    );
  }

  delete(path: string, id: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.baseUrl + path + id + '/', {headers: this.headers}).pipe(
      tap((response: any) => response as HttpUserEvent<any>),
      catchError(() => from([]))
    )
  }


}
