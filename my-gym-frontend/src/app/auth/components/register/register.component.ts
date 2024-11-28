import {Component, OnInit} from '@angular/core';
import {EmailValidator, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
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
        RouterLink
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

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
      nome: ['', [Validators.email, Validators.required]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      tipo_usuario: ['D', Validators.required],
    });
  }


  public authentic(credentials: Credentials): void {
    this.httpMethods.post(this.pathUrlUser, credentials).subscribe(
      (response: any) => {
        console.log(response)
        this.router.navigate(['auth/login']);
      },
      (error: any) => {
        console.log(error);
        alert(error.message);
      }
    )
  }

}
