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

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatButton,
    MatListModule,
    MatCardModule,
    PaginatorComponent
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

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia")
  }

  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getIdGym()
    this.search()
    this.getTypeUser()
  }

  public getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public search(offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      academia: this.gym_id,
      active: true,
      limit,
      offset
    };

    this.httpMethods.getPaginated(this.pathUrlPlan, params)
      .subscribe((response: any) => {
        if (response.results.length <= 0) {
          const errosMensager = "Não há planos ativos cadastrados!"
          this.snackBar.open(errosMensager, 'fechar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
        this.plans = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      });
  }

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.search(offset);
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
