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
import {DecimalPipe, NgForOf} from "@angular/common";
import {debounceTime, Subject} from "rxjs";
import {MatButton} from "@angular/material/button";

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
    NgForOf,
    DecimalPipe,
    MatButton
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
  public currentPage: number = 0;
  public limit: number = 30;
  public totalResults: number = 0;

  selectedIndex: number = 0;
  searchChanged = new Subject<string>();


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
    this.getTypeUser()
    this.search()

    this.searchChanged.pipe(debounceTime(300)).subscribe((term) => {
      this.searchMember(term, 0);
    });

  }

  public search(): void {
    this.searchMember(this.searchTerm, 0);
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

  trackById(index: number, member: MemberPlan) {
    return member.aluno.id;
  }

  public searchMember(term: string = '', offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      expand: ['aluno', 'plano'],
      active: true,
      academia: this.gym_id,
      limit,
      offset,
    };

    if (term) {
      params.search = term;
    }

    this.httpMethods.getPaginated(this.pathUrlMemberPlan, params)
      .subscribe((response: any) => {
        this.membersPlan = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      });
  }

  public nextPage(): void {
    const maxPage = Math.ceil(this.totalResults / this.limit) - 1;
    if (this.currentPage < maxPage) {
      const nextOffset = (this.currentPage + 1) * this.limit;
      this.searchMember(this.searchTerm, nextOffset);
    }
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      const prevOffset = (this.currentPage - 1) * this.limit;
      this.searchMember(this.searchTerm, prevOffset);
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChanged.next(term);
  }

}
