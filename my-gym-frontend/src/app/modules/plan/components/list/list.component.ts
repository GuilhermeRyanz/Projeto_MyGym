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

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatButton,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlPlan: string = URLS.PLAN;
  protected plans: Plan[] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
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
    this.seach()
    this.getTypeUser()
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public seach(): void {
    this.httpMethods.get(this.pathUrlPlan + `?academia=${(this.gym_id)}&active=true`).subscribe((response: any) => {
      console.log(response);
      if (response.length <= 0) {
        const errosMensager = "Não há planos ativos cadastrados!"
        this.snackBar.open(errosMensager, 'fechar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
      this.plans = response
    });
  }

  public create(): void {
    this.router.navigate(['/plan/form/create']).then();
  }

  public edit(plan: Plan): void {
    this.router.navigate([`/plan/form/${plan.id}`]).then();
  }

  public viewDetail(plano:  Plan): void {
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
          this.seach()
          let sucessMensage =  "Plano desativado"
          this.snackBar.open(  sucessMensage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        })
      }
    });
  }

}
