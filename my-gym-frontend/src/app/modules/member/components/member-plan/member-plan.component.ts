import {Component, Input, OnInit,} from '@angular/core';
import {Member} from "../../../../shared/interfaces/member";
import {URLS} from "../../../../app.urls";
import {Plan} from "../../../../shared/interfaces/plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-member-plan',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatIcon,
    MatButton,
    DecimalPipe,

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
  public limit: number = 6;
  public currentPage: number = 0;
  public totalResults: number = 0;


  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.getIdGym()
    this.search()
    this.getTypeUser()
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia")
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("usuario_tipo")
  }

  public search(offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      academia: this.gym_id,
      active: true,
      limit,
      offset,
    }

    this.httpMethods.getPaginated(this.pathUrlPlan, params)
      .subscribe((response) => {
        if (response.results.length <= 0) {
          const errorMensager = "Não há planos ativos cadastrados!"
          this.snackBar.open(errorMensager, `fechar`,{
            duration: 2000,
            verticalPosition: "top",
          });
        }

        this.plans = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      });
  }

  public nextPage() {
    const maxPage = Math.ceil(this.totalResults / this.limit) - 1;
    if (this.currentPage < maxPage) {
      const nextOffset = (this.currentPage + 1) * this.limit;
      this.search(nextOffset)
    }
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      const prevOffset = (this.currentPage - 1) * this.limit;
      this.search(prevOffset);
    }
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

