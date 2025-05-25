import { Component } from '@angular/core';
import {HttpMethodsService} from "../../../shared/services/httpMethods/http-methods.service";
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-member-auth',
  standalone: true,
  imports: [],
  templateUrl: './member-auth.component.html',
  styleUrl: './member-auth.component.css'
})
export class MemberAuthComponent {

  private formGroup: FormGroup;

  constructor(
      private httpMethods: HttpMethodsService,
      private router: Router,
      private snackBar: MatSnackBar,
      private authService: HttpMethodsService,
      private formBuilder: FormBuilder,
  ) {

    this.formGroup = this.formBuilder.group({
      matricula: [null, Validators.required],
      email: [null , Validators.required],
    });
  };

  public login(): void {
    this.httpMethods.post('memberLogin/', this.formGroup.value).subscribe(
      response => {

      }
    )
  }
}
