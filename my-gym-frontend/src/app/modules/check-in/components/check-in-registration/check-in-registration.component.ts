import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberPlan} from "../../../../shared/interfaces/member-plan";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {CheckInConfirmComponent} from "../check-in-confirm/check-in-confirm.component";
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {debounceTime, Subject} from "rxjs";
import {PaginatorComponent} from "../../../../shared/components/paginator/paginator.component";

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
    MatIcon,
    PaginatorComponent
  ],
  templateUrl: './check-in-registration.component.html',
  styleUrl: './check-in-registration.component.css'
})
export class CheckInRegistrationComponent implements OnInit {

  public obj?: MemberPlan = undefined;
  private pathUrlMemberPlan: string = URLS.MEMBERPLAN;
  public membersPlan: MemberPlan[] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
  public searchTerm: string = "";
  public currentPage: number = 0;
  public limit: number = 10;
  public totalResults: number = 0;

  selectedIndex: number = 0;
  searchChanged = new Subject<string>();

  constructor(private httpMethods: HttpMethodsService) {}

  ngOnInit() {
    this.getIdGym();
    this.getTypeUser();
    this.search();

    this.searchChanged.pipe(debounceTime(300)).subscribe((term) => {
      this.searchMember(term, 0); // volta pra primeira página a cada nova busca
    });
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  private getTypeUser(): void {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public search(): void {
    this.searchMember(this.searchTerm, 0);
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

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.searchMember(this.searchTerm, offset);
  }

  trackById(index: number, member: MemberPlan): number {
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

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChanged.next(term);
  }
}
