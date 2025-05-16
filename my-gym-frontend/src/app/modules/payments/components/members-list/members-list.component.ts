import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {URLS} from "../../../../app.urls";
import {MemberPlan} from "../../../../shared/interfaces/member-plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MemberPaymentsComponent} from "../member-payments/member-payments.component";
import {NgForOf} from "@angular/common";
import {debounceTime, Subject} from "rxjs";
import {PaginatorComponent} from "../../../../shared/components/paginator/paginator.component";

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatCard,
    MatCardContent,
    NgForOf,
    PaginatorComponent,
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MembersListComponent implements OnInit {
  private pathUrlMemberPlan: string = URLS.MEMBERPLAN
  public members: MemberPlan [] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
  public searchTerm: string = "";
  public limit: number = 12;
  public totalResults: number = 0;
  public currentPage: number = 0;

  searchChanged = new Subject<string>();

  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
  ) {
  }


  ngOnInit() {
    this.getIdGym();
    this.search();
    this.getTypeUser()

    this.searchChanged.pipe(debounceTime(100))
      .subscribe((term) => {
        this.searchMember(term, 0)
      })

  }


  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public search(): void {
    this.searchMember(this.searchTerm , 0)
  };

  public searchMember(term: string = "", offset: number = 0 , limit = this.limit): void {
    const params: any = {
      expand: ['aluno', 'plano'],
      academia: this.gym_id,
      active: true,
      limit,
      offset,
    }

    if (term){
      params.search = term
    }

    this.httpMethods.getPaginated(this.pathUrlMemberPlan, params)
      .subscribe((response: any) => {
        this.members = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      })

  }

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.searchMember(this.searchTerm, offset);
  }



  trackById(index: number, member: MemberPlan) {
    return member.aluno.id;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  public selectMember(member: MemberPlan): void {
    this.dialog.open(MemberPaymentsComponent, {
      width: '40rem',
      maxWidth: 'none',
      data: { memberInfo: member }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChanged.next(term);
  }

}
