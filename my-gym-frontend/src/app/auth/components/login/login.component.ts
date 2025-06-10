import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatTabGroup,
    MatTab,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  selectedTab: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    localStorage.clear();
  }

  public authentic(credentials: { username: string; password: string }): void {
    const payload = {
      username: credentials.username,
      password: credentials.password
    };
    this.authService.login(payload).subscribe({
      next: () => console.log('Login de usuário bem-sucedido'),
      error: (err) => console.error('Erro no login de usuário:', err)
    });
  }

  public authenticMember(credentials: { username: string; password: string }): void {
    const payload = {
      username: credentials.username,
      password: credentials.password
    };
    this.authService.loginMember(payload).subscribe({
      next: () => console.log('Login de aluno bem-sucedido'),
      error: (err) => console.error('Erro no login de aluno:', err)
    });
  }
}
