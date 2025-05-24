import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Member} from "../../../../shared/interfaces/member";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MemberPlan} from "../../../../shared/interfaces/member-plan";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentComponent} from "../confirm-dialog-component/confirm-dialog-component.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {debounceTime, Subject} from "rxjs";
import {PaginatorComponent} from "../../../../shared/components/paginator/paginator.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {PlanServiceService} from "../../../../shared/services/plan/plan-service.service";
import {Plan} from "../../../../shared/interfaces/plan";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCard,
    MatIcon,
    MatCardContent,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    PaginatorComponent,
    MatSelect,
    MatOption,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuTrigger
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})

export class ListComponent implements OnInit {

  private pathUrlMemberPlan: string = URLS.MEMBERPLAN
  public members: MemberPlan [] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
  public searchTerm: string = "";
  public limit: number = 12;
  public totalResults: number = 0;
  public currentPage: number = 0;
  public plans: Plan[] = [];
  public expired : boolean = false;

  searchChange = new Subject<string>();

  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              ) {
  }

  public selectedPlan: string | null = null;

  ngOnInit() {
    this.getIdGym();
    this.search();
    this.getTypeUser()
    this.loadPlans();


    this.searchChange.pipe(debounceTime(100)).subscribe((term) => {
      this.searchMember(term, 0)
    })

  }

  public getMemberStatus(data: Date | string | null): string {
    if (!data) return 'Indefinido';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // zerar hora local

    const compareDate = new Date(data);
    compareDate.setHours(0, 0, 0, 0); // também zera hora

    if (compareDate.getTime() < today.getTime()) return 'Inadimplente';
    if (compareDate.getTime() === today.getTime()) return 'Expira Hoje';
    return 'Ativo';
  }

  public getMemberStatusColor(data: Date | string | null): string {
    if (!data) return '#858585';

    const status = this.getMemberStatus(data);
    const statusColors: Record<string, string> = {
      'Inadimplente': '#d82d2d',
      'Expira Hoje': '#D8A22DFF',
      'Ativo': '#2dd853',
      'Indefinido': '#858585'
    };

    return statusColors[status] || '#858585';
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  private getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public search(): void {
    this.searchMember(this.searchTerm, 0)
  };

  public create(): void {
    this.router.navigate(['/member/form/create']).then();
  };

  public edit(member: Member) {
    this.router.navigate([`/member/form/${member.id}`]).then();
  };

  trackById(index: number, member: MemberPlan) {
    return member.aluno.id;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  public disable(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.gym_id) {
          member.academia = this.gym_id;
        } else {
          console.error('Gym ID is missing');
          return;
        }
        this.httpMethods.disable(this.pathUrlMemberPlan, member, 'desativar_aluno').subscribe(() => {
          this.searchMember();
          let sucessMensage =  "Aluno desativado"
          this.snackBar.open(  sucessMensage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        })
      }
    })
  };

  public searchMember(term: string = "", offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      expand: ['aluno', 'plano'],
      active: true,
      academia: this.gym_id,
      limit,
      offset,
    };

    if (this.selectedPlan) {
      params.plano = this.selectedPlan;
    }

    if (term){
      params.search = term
    }

    if (this.expired) {
      params.expired  = true;
    }

    this.httpMethods.getPaginated(this.pathUrlMemberPlan, params)
      .subscribe((response: any) => {
        this.members = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      })
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChange.next(term);
  }

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.searchMember(this.searchTerm, offset);
  }

  public toogleInadimplente(): void {
    this.expired = !this.expired;
    this.search()
  }

  private loadPlans(): void {
    this.httpMethods.get(URLS.PLAN + { academia: this.gym_id })
      .subscribe((response: any) => {
        this.plans = response.results;
      });
  }
  public onPlanChange(): void {
    this.search();
  }


}
