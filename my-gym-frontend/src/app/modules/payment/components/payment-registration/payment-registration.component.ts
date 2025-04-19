import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {URLS} from "../../../../app.urls";
import {MemberPlan} from "../../../../shared/interfaces/member-plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {PaymentConfirmComponent} from "../payment-confirm/payment-confirm.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-payment-registration',
  standalone: true,
    imports: [
        FormsModule,
        MatCard,
        MatCardContent,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatTabGroup,
        MatTab,
        PaymentConfirmComponent,
        NgForOf
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

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  trackById(index: number, member: MemberPlan) {
    return member.aluno.id;
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
