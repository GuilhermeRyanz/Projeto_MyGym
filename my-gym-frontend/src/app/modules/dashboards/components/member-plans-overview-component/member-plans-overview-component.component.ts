import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {NgxEchartsDirective, provideEcharts} from "ngx-echarts";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MY_DATE_FORMATS} from "../date-format";
import {MatCard, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {HelpMensageComponent} from "./help-mensage/help-mensage.component";

@Component({
  selector: 'app-member-plans-overview-component',
  standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        NgxEchartsDirective,
        MatCardModule,
        MatIcon,
    ],
  templateUrl: './member-plans-overview-component.component.html',
  styleUrl: './member-plans-overview-component.component.css',
  providers: [
    provideEcharts(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

  ]

})
export class MemberPlansOverviewComponentComponent implements OnInit {

  public gym_id: string | null = "";
  private pathUrlMemberPlanOverView: string = URLS.MEMBERPLANOVERVIEW;
  public chartOption: any;
  public membersall: string | null = '0';

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

  help(){
    const dialogRef = this.dialog.open(HelpMensageComponent);
    dialogRef.afterClosed()

  }

  search(): void {
    this.httpMethods.get(this.pathUrlMemberPlanOverView + `?academia=${this.gym_id}`).subscribe(
      response => {
        const plans = response.planos;
        this.membersall = response.total_sum;

        if (Array.isArray(plans)) {
          const chartData = plans.map((item: any) => ({
            name: item.plano,
            value: item.alunos_ativos
          }));

          this.chartOption = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [
              {
                name: 'Distribuição de Alunos',
                type: 'pie',
                radius: '55%',
                data: chartData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
        }
      },
      error => {
        console.error('Erro ao carregar os dados dos planos:', error);
      }
    );
  }
}
