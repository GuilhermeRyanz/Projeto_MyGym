import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Credentials} from "../../interfaces/credentials";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    NgOptimizedImage,

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

  export class LoginComponent implements OnInit{
    formGroup: FormGroup;

    ngOnInit() {
      localStorage.clear()
    }


  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
    ) {
      this.formGroup = this.formBuilder.group({
        username: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
      });
    }


    public authentic(credentials: Credentials): void {
      this.authService.login(credentials).subscribe()
    }


  }
