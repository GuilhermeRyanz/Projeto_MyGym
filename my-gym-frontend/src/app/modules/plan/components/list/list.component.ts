import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Plan} from "../../interfaces/plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
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

  public disable(plan: Plan): void {
    this.httpMethods.disable(this.pathUrlPlan, plan, 'desativar').subscribe(() => {
      this.seach()
    });
  }

}
