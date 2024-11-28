import {Component, Input, OnInit} from '@angular/core';
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {URLS} from "../../../../app.urls";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-confirm',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatRadioButton,
    MatRadioGroup
  ],
  templateUrl: './payment-confirm.component.html',
  styleUrl: './payment-confirm.component.css'
})
export class PaymentConfirmComponent implements OnInit {
  @Input('member') memberPlan?: MemberPlan;
  private gymId: string | null = "";
  protected formGroup: FormGroup;
  private pathUrlPayment: string = URLS.PAYMENT;


  getGym(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({academia: this.gymId});
    }
    console.log( 'Member Plan',this.memberPlan?.id);
  }

  constructor(
    private formBuilder: FormBuilder,
    private httpMethods: HttpMethodsService,
    private router: Router,

  ) {
    this.formGroup = this.formBuilder.group({
      aluno_plano: [this.memberPlan?.id],
      tipo_pagamento: [''],
      academia: [this.gymId]
    })
  }

  ngOnInit() {
    this.getGym()
  }


  public confirm() {

    this.formGroup.patchValue({aluno_plano: this.memberPlan?.id});
    console.log('Form Data:', this.formGroup.value);
    this.httpMethods.post(this.pathUrlPayment, this.formGroup.value).subscribe(
      response => {
        console.log('Pagamento confirmado', response);
        this.router.navigate(['payment/paymentoConfirm']);

      },
      error => {
        console.error('Erro ao confirmar pagamento', error);
      }
    );
  }
}
