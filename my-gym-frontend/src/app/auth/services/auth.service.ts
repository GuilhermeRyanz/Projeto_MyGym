import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Credentials } from "../interfaces/credentials";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: Credentials) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post('http://127.0.0.1:8000/api/token/', payload, { headers }).pipe(
      tap((response: any) => {
        this.setToken(response.token);

        // Armazenar dados adicionais no localStorage
        localStorage.setItem('tipo_usuario', response.tipo_usuario);

        if (response.academia_id) {
          localStorage.setItem('academia_id', response.academia_id);
        }

        // Redirecionamento baseado no tipo de usuário
        const tipoUsuario = response.tipo_usuario;

        if (tipoUsuario === 'D') { // Dono
          localStorage.setItem('user_id', response.user_id); // Armazenar ID do usuário
          this.router.navigate(['/home']);
        } else if (tipoUsuario === 'A' || tipoUsuario === 'G') { // Atendente ou Gerente
          this.router.navigate(['/home/funcionario', tipoUsuario.toLowerCase()]);
        } else {
          console.error('Tipo de usuário não reconhecido:', tipoUsuario);
        }
      }),
    );
  }

  private setToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  public logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('academia_id');
    localStorage.removeItem('user_id');
    this.router.navigate(["/auth/login"]).then();
  }
}
