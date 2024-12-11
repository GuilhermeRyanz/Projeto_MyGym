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
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-member-plan',
  standalone: true,
  imports: [
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatList,
    MatIcon,
    MatButton,
    MatRadioButton,
    MatListSubheaderCssMatStyler,
    MatCardActions,
    MatCardHeader,
    MatCardSubtitle,
    MatIconButton
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
              private dialog: MatDialog
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
      this.plans = response
      console.log(response);
    });
  }

  public editPlan(plan: Plan): void {

    const new_body = {
      aluno: this.member?.id,
      plano: plan.id,
      academia: plan.academia

    }

    console.log(`aluno` ,this.member?.id)

    this.httpMethods.post(this.pathUrlPlanMember + 'alterar_plano/', new_body).subscribe((response: any) => {
      console.log(response);
    })
  }
  public return(){
    this.router.navigate(['/member/list/'])
  }

}

