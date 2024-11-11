import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../interfaces/credentials';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {TokenService} from "../../shared/services/httpMethods/token-service.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUser: boolean = false;

  showBannerEmmiter = new EventEmitter<boolean>();
  userUpdateEmitter = new EventEmitter<void>();

  private apiUrl = 'http://127.0.0.1:8000/api/token/';

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}

  login(payload: Credentials) {
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post(this.apiUrl, payload, { headers }).pipe(
      tap((response: any) => {
        this.setToken(response.access_token);
        localStorage.setItem('tipo_usuario', response.tipo_usuario);
        localStorage.setItem('email', response.email);
        localStorage.setItem('nome_usuario', response.name);

        if (response.academia) {
          localStorage.setItem('academia', response.academia);
        }

        this.authUser = true;
        this.showBannerEmmiter.emit(true);
        this.userUpdateEmitter.emit();

        const tipoUsuario = response.tipo_usuario;
        if (tipoUsuario === 'D') {
          this.router.navigate(['/adm/gym/list/']);
        } else if (tipoUsuario === 'A' || tipoUsuario === 'G') {
          this.router.navigate([`/my_gym/home/`]);
        }
      })
    );
  }

  private setToken(accessToken: string) {
    this.tokenService.setToken(accessToken);
  }

  public logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('academia');
    localStorage.removeItem('user_id');
    localStorage.removeItem('nome_usuario');
    localStorage.removeItem('email');
    this.router.navigate(['/auth/login']).then();
  }

  userIsAuth(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  userIsAuthGy(): boolean {
    return !!localStorage.getItem('academia');
  }
}
