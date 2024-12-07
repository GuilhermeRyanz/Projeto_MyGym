import { Component, OnInit } from '@angular/core';
import { URLS } from "../../../../app.urls";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { NgxEchartsDirective } from "ngx-echarts";
import { MatCard, MatCardHeader, MatCardTitle } from "@angular/material/card";

@Component({
  selector: 'app-plans-with-new-members-component',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    NgxEchartsDirective
  ],
  templateUrl: './plans-with-new-members-component.component.html',
  styleUrl: './plans-with-new-members-component.component.css'
})
export class PlansWithNewMembersComponentComponent implements OnInit {

  private pathUrlPlansWithNewMembers: string = URLS.PLANSWITHNEWMEMBERS;
  private gym_id: string | null = "";
  public chartOption: any;

  constructor(private httpMethods: HttpMethodsService) { }

  ngOnInit() {
    this.getIdGym();
    this.search();
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  search(): void {
    this.httpMethods.get(this.pathUrlPlansWithNewMembers + `?academia=${this.gym_id}`).subscribe(
      (response: any) => {
        const plans = response.map((item: any) => item.plano_nome);
        const newMembers = response.map((item: any) => item.novos_alunos);

        this.chartOption = {
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} alunos"
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
