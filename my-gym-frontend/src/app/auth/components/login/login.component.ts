import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Credentials} from "../../interfaces/credentials";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

  export class LoginComponent {
    formGroup: FormGroup;


    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
      this.formGroup = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    }

    public authentic(credentials: Credentials): void {
      this.authService.login(credentials).subscribe(
        (response: any) => {
          this.router.navigate(['/home']).then();
        },
        (error) => {
          console.error('Erro de autenticação', error);
          alert('Credenciais inválidas! Tente novamente.');
        }
      );
    }
  }
