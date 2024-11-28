import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatListSubheaderCssMatStyler} from "@angular/material/list";
import {MatRadioButton} from "@angular/material/radio";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {PaymentConfirmComponent} from "../../../payment/components/payment-confirm/payment-confirm.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {CheckInConfirmComponent} from "../check-in-confirm/check-in-confirm.component";

@Component({
  selector: 'app-check-in-registration',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatListSubheaderCssMatStyler,
    MatRadioButton,
    MatTab,
    MatTabGroup,
    PaymentConfirmComponent,
    ReactiveFormsModule,
    FormsModule,
    CheckInConfirmComponent
  ],
  templateUrl: './check-in-registration.component.html',
  styleUrl: './check-in-registration.component.css'
})
export class CheckInRegistrationComponent implements OnInit {

  public obj?: MemberPlan = undefined;
  private pathUrlMemberPlan: string = URLS.MEMBERPLAN
  public membersPlan: MemberPlan [] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
  public searchTerm: string = "";
  selectedIndex: number = 0;


  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("usuario_tipo");
  }

  constructor(private httpMethods: HttpMethodsService,) {
  }

  ngOnInit() {
    this.getIdGym();
    this.seach();
    this.getTypeUser()
  }

  public seach(): void {
    this.httpMethods.get(this.pathUrlMemberPlan + `?expand=aluno&expand=plano&active=true&academia=${this.gym_id}`).subscribe((response: any) => {
      this.membersPlan = response;
    });
  };

  makePayment(member: MemberPlan): void {
    this.obj = member;
    this.selectedIndex = 1;

  }

  public searchMember(): void {
    let searchParam = '';
    if (this.searchTerm) {
      searchParam = `&search=${this.searchTerm}`;
    }
    this.httpMethods.get(`${this.pathUrlMemberPlan}?expand=aluno&expand=plano&active=true${searchParam}&academia=${this.gym_id}`)
      .subscribe((response: any) => {
        this.membersPlan = response;
        console.log(response);
      });
  }

}
