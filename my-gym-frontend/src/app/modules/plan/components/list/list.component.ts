import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Plan} from "../../interfaces/plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";

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

  constructor(private httpMethods: HttpMethodsService, private router: Router) {
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
