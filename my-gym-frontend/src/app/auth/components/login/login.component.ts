import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Credentials} from "../../interfaces/credentials";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {Gym} from "../../../modules/gym-list/interfaces/gym";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

  export class LoginComponent {
    formGroup: FormGroup;



    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
    ) {
      this.formGroup = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    }


    public authentic(credentials: Credentials): void {
      this.authService.login(credentials).subscribe(
        (response: any) => {
          console.log(response)
        },
        (error: any) => {
          console.log(error);
          alert(error.message);
        }
      )
    }


  }
