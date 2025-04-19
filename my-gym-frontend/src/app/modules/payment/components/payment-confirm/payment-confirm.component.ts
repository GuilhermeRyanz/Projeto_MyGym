import {Component, Input, OnInit} from '@angular/core';
import {MemberPlan} from "../../../../shared/interfaces/member-plan";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {URLS} from "../../../../app.urls";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-payment-confirm',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatRadioButton,
    MatRadioGroup,
    CurrencyPipe
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
  }

  constructor(
    private formBuilder: FormBuilder,
    private httpMethods: HttpMethodsService,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.formGroup = this.formBuilder.group({
      aluno_plano: [this.memberPlan?.id],
      tipo_pagamento: [''],
      academia: [this.gymId]
    })
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  ngOnInit() {
    this.getGym()
  }


  public confirm() {

    this.formGroup.patchValue({aluno_plano: this.memberPlan?.id});
    this.httpMethods.post(this.pathUrlPayment, this.formGroup.value).subscribe(
      response => {
      let sucessMensagem = "Pagamento efetuado com sucesso.";
        this.router.navigate(['payment/paymentRegistration']);
        this.snackBar.open(  sucessMensagem, 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
        })

      },
    );
  }
}
