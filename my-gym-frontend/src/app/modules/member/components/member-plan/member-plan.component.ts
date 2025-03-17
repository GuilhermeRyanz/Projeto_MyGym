import {Component, Input, OnInit,} from '@angular/core';
import {Member} from "../../interfaces/member";
import {URLS} from "../../../../app.urls";
import {Plan} from "../../../plan/interfaces/plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatList, MatListSubheaderCssMatStyler} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatRadioButton} from "@angular/material/radio";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-member-plan',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatIcon,
    MatButton,

  ],
  templateUrl: './member-plan.component.html',
  styleUrl: './member-plan.component.css'
})
export class MemberPlanComponent implements OnInit {

  @Input('member') member?: Member;

  private pathUrlPlan: string = URLS.PLAN;
  private pathUrlPlanMember: string = URLS.MEMBERPLAN
  protected plans: Plan[] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia")
  }

  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.getIdGym()
    this.seach()
    this.getTypeUser()
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("usuario_tipo")
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

  public editPlan(plan: Plan): void {

    const new_body = {
      aluno: this.member?.id,
      plano: plan.id,
      academia: plan.academia

    }
    this.httpMethods.post(this.pathUrlPlanMember + 'alterar_plano/', new_body).subscribe(() => {
      const sucessMensage = "Aluno vinculado a plano"
      this.snackBar.open(sucessMensage, 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
      });
      this.router.navigate(['/member/list/']);

    })
  }

}

