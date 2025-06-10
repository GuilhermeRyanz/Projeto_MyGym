import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {Credentials} from "../../interfaces/credentials";
import {URLS} from "../../../app.urls";
import {HttpMethodsService} from "../../services/http-methods.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatError
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private pathUrlUser: string = URLS.USERS
  formGroup: FormGroup;

  ngOnInit() {
    localStorage.clear()
  }


  constructor(
    private formBuilder: FormBuilder,
    private httpMethods: HttpMethodsService,
    private router: Router,
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'),
      ]],
      tipo_usuario: ['D', Validators.required],
    });
  }


  public createAccount(credentials: Credentials): void {
    this.httpMethods.post(this.pathUrlUser, credentials).subscribe(
      (response: any) => {
        console.log(response)
        this.router.navigate(['auth/login']);
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

}
