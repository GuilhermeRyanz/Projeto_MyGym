import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromLocalStorage());
  public token$ = this.tokenSubject.asObservable();

  constructor() {}

  getTokenFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  public setToken(token: string): void {
    localStorage.setItem('accessToken', token);
    this.tokenSubject.next(token);
  }

  public removeToken(): void {
    localStorage.removeItem('accessToken');
    this.tokenSubject.next(null);
  }
}
