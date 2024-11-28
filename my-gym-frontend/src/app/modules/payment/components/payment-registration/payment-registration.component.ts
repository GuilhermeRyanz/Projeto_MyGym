import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatListSubheaderCssMatStyler} from "@angular/material/list";
import {URLS} from "../../../../app.urls";
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {PaymentConfirmComponent} from "../payment-confirm/payment-confirm.component";
import {MatRadioButton} from "@angular/material/radio";

@Component({
  selector: 'app-payment-registration',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatListSubheaderCssMatStyler,
    MatTabGroup,
    MatTab,
    PaymentConfirmComponent,
    MatRadioButton
  ],
  templateUrl: './payment-registration.component.html',
  styleUrl: './payment-registration.component.css'
})
export class PaymentRegistrationComponent implements OnInit {

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
