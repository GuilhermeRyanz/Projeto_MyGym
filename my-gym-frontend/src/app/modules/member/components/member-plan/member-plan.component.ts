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
import {fomateDayWeek} from "../../../../shared/util/FomateDayWeek";
import {PaginatorComponent} from "../../../../shared/components/paginator/paginator.component";
import {AuthService} from "../../../../auth/services/auth.service";

@Component({
  selector: 'app-member-plan',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    MatIcon,
    MatButton,
    PaginatorComponent,

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
  public limit: number = 5;
  public currentPage: number = 0;
  public totalResults: number = 0;


  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.search()
    this.getTypeUser()
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("usuario_tipo")
  }

  public search(offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      academia: this.authService.get_gym(),
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

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.search(offset);
  }

  protected readonly fomateDayWeek = fomateDayWeek;
}

