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
import {MatOption} from "@angular/material/select";
import {Plan} from "../../../../shared/interfaces/plan";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {AuthService} from "../../../../auth/services/auth.service";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {NgForOf, NgIf} from "@angular/common";

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
    MatOption,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuTrigger,
    MatAutocomplete,
    MatAutocompleteTrigger,
    NgForOf,
    NgIf

  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})

export class ListComponent implements OnInit {

  private pathUrlMemberPlan: string = URLS.MEMBERPLAN
  public members: MemberPlan [] | undefined;
  public searchTerm: string = "";
  public searchPlanTerm: string = "";
  public limit: number = 12;
  public totalResults: number = 0;
  public currentPage: number = 0;
  public plans: Plan[] = [];
  public expired : boolean = false;

  searchChange = new Subject<string>();
  searchPlanChange = new Subject<string>();

  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private authService: AuthService
              ) {
  }

  displayPlanFn(plan: Plan | null): string {
    return plan ? plan.nome : '';
  }

  public selectedPlan: string | null = null;


  ngOnInit() {
    this.search();
    this.searchPlan();

    this.searchChange.pipe(debounceTime(100)).subscribe((term) => {
      this.searchMember(term, 0)
    })

    this.searchPlanChange.pipe(debounceTime(100)).subscribe((term) => {
      this.searchPlan(term)
    })

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

  public disable(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const gymId = this.authService.get_gym()
        if (!gymId) {
          return
        }
        member.academia = gymId

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
      academia: this.authService.get_gym(),
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

  onSelectedPlan(event: any): void {
    this.selectedPlan = event.option.value.id;
    this.searchMember(this.searchTerm, 0);
  }

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.searchMember(this.searchTerm, offset);
  }

  public toogleInadimplente(): void {
    this.expired = !this.expired;
    this.search()
  }

  private searchPlan(term: string = ""): void {

    const params: any = {
      active: true,
      academia: this.authService.get_gym(),
      limit: 20,
      offset: 0,
    };

    if (term) {
      params.search = term;
    }

    this.httpMethods.getPaginated(URLS.PLAN, params)
      .subscribe((response: any) => {
        this.plans = response.results;
      });
  }

  onSearchPlanChange(term: string): void {
    this.searchPlanTerm = term
    this.searchPlanChange.next(term)
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

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  public clearPlanFilter(): void {
    this.selectedPlan = null;
    this.searchPlanTerm = '';
    this.searchMember(this.searchTerm, 0);
  }


}
