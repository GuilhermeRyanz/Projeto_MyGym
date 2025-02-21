import { Component, OnInit } from '@angular/core';
import { URLS } from "../../../../app.urls";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { NgxEchartsDirective } from "ngx-echarts";
import { MatCard, MatCardHeader, MatCardTitle } from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {HelpMensageComponent} from "./help-mensage/help-mensage.component";

@Component({
  selector: 'app-plans-with-new-members-component',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    NgxEchartsDirective,
    MatIcon
  ],
  templateUrl: './plans-with-new-members-component.component.html',
  styleUrl: './plans-with-new-members-component.component.css'
})
export class PlansWithNewMembersComponentComponent implements OnInit {

  private pathUrlPlansWithNewMembers: string = URLS.PLANSWITHNEWMEMBERS;
  private gym_id: string | null = "";
  public chartOption: any;
  public allnewMebers: string | null = "0"

  constructor(
    private httpMethods: HttpMethodsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getIdGym();
    this.search();
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  help(): void{
    const dialogRef = this.dialog.open(HelpMensageComponent);
    dialogRef.afterClosed()
  }

  search(): void {
    this.httpMethods.get(this.pathUrlPlansWithNewMembers + `?academia=${this.gym_id}`).subscribe(
      (response: any) => {
        const plans = response.novos_alunos.map((item: any) => item.plano_nome);
        const newMembers = response.novos_alunos.map((item: any) => item.novos_alunos);
        this.allnewMebers = response.total_sum

        this.chartOption = {
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} novos alunos"
          },
          series: [{
            name: 'Novos Alunos por Plano',
            type: 'pie',
            radius: [25, 170],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: plans.map((name: any, index: number) => ({
              name,
              value: newMembers[index]
            }))
          }]
        };
      },
      (error) => {
        console.error("Erro ao carregar os dados do gráfico:", error);
      }
    );
  }
}
