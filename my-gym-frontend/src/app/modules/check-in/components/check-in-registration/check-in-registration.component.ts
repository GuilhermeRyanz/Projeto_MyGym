import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {CheckInConfirmComponent} from "../check-in-confirm/check-in-confirm.component";
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-check-in-registration',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    FormsModule,
    CheckInConfirmComponent,
    NgForOf,
    MatIcon
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
    this.typeUser = localStorage.getItem("tipo_usuario");
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

  trackById(index: number, member: MemberPlan) {
    return member.aluno.id;
  }

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

  public searchMember(): void {
    let searchParam = '';
    if (this.searchTerm) {
      searchParam = `&search=${this.searchTerm}`;
    }
    this.httpMethods.get(`${this.pathUrlMemberPlan}?expand=aluno&expand=plano&active=true${searchParam}&academia=${this.gym_id}`)
      .subscribe((response: any) => {
        this.membersPlan = response;
      });
  }

}
