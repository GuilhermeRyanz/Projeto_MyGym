import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Plan} from "../../../../shared/interfaces/plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import {
  ConfirmDialogComponentComponent
} from "../../../member/components/confirm-dialog-component/confirm-dialog-component.component";
import {MatDialog} from "@angular/material/dialog";
import {PlanDetailComponent} from "../plan-detail/plan-detail.component";
import {PaginatorComponent} from "../../../../shared/components/paginator/paginator.component";
import {fomateDayWeek} from "../../../../shared/util/FomateDayWeek";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, Subject} from "rxjs";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatButton,
    MatListModule,
    MatCardModule,
    PaginatorComponent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlPlan: string = URLS.PLAN;
  protected plans: Plan[] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
  public limit: number = 3;
  public totalResults: number = 1;
  public currentPage: number = 0;
  public searchTerm: string = "";
  public searchChange = new Subject<string>();


  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getTypeUser()
    this.search()
    this.searchChange.pipe(debounceTime(300)).subscribe((term) => {
      this.search(term, 0)
    })
  }

  public getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public search(term: string = " " ,offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      academia: this.gym_id,
      active: true,
      limit,
      offset
    };

    if (term) {
      params.search = term;
    }

    this.httpMethods.getPaginated(this.pathUrlPlan, params)
      .subscribe((response: any) => {
        this.plans = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChange.next(term);
  }

  onPageChange(page: number): void {
    this.search();
  }

  public create(): void {
    this.router.navigate(['/plan/form/create']).then();
  }

  public edit(plan: Plan): void {
    this.router.navigate([`/plan/form/${plan.id}`]).then();
  }

  public viewDetail(plano: Plan): void {
    this.dialog.open(PlanDetailComponent, {
      width: '40rem',
      maxWidth: 'none',
      data: plano
    });
  }

  public disable(plan: Plan): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent)
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.httpMethods.disable(this.pathUrlPlan, plan, 'desativar').subscribe(() => {
          this.search()
          let sucessMensage = "Plano desativado"
          this.snackBar.open(sucessMensage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        })
      }
    });
  }

  protected readonly fomateDayWeek = fomateDayWeek;
}
