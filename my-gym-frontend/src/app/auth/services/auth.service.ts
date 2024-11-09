import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../interfaces/credentials';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authUser : boolean = false

  showBannerEmmiter = new EventEmitter<boolean>();

  private apiUrl = 'http://127.0.0.1:8000/api/token/';

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: Credentials) {
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post(this.apiUrl, payload, { headers }).pipe(
      tap((response: any) => {
        this.setToken(response.access_token);

        localStorage.setItem('tipo_usuario', response.tipo_usuario);

        localStorage.setItem('email', response.email);

        localStorage.setItem('nome_usuario', response.name);

        if (response.academia_id) {
          localStorage.setItem('academia', response.academia);
        }

        this.authUser = true
        this.showBannerEmmiter.emit(true);

        const tipoUsuario = response.tipo_usuario;

        if (tipoUsuario === 'D') {
          // localStorage.setItem('user_id', response.user_id); // Armazenar ID do usuário
          this.router.navigate(['/adm/gym/list']);
        }
        else if (tipoUsuario === 'A') {
          this.router.navigate([`/home/atendente/${response.academia}`, tipoUsuario.toLowerCase()]);
        }
        else if (tipoUsuario === 'G') {
          this.router.navigate([`/home/gerente/${response.academia}`, tipoUsuario.toLowerCase()]);

        }


      })
    );
  }

  userIsAuth() {
    return this.authUser;
  }

  private setToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
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
}
