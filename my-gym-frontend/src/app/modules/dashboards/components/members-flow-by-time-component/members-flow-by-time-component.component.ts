import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from "ngx-echarts";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatFormField, MatInput, MatInputModule} from "@angular/material/input";
import { URLS } from "../../../../app.urls";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import {CommonModule, NgClass} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatLabel } from "@angular/material/form-field";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter} from "@angular/material/core";
import {MY_DATE_FORMATS} from "../date-format";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-members-flow-by-time-component',
  standalone: true,
  imports: [
    NgxEchartsDirective,
    CommonModule,
    MatCardModule,
    MatInputModule,
    NgClass,
    FormsModule,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatLabel,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './members-flow-by-time-component.component.html',
  styleUrl: './members-flow-by-time-component.component.css',
  providers: [
    provideEcharts(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

  ]
})
export class MembersFlowByTimeComponentComponent implements OnInit {

  public beginDate: Date = new Date(new Date().setDate(new Date().getDate() - 30));
  public endDate: Date = new Date();
  public chartOption: any = {};
  public gym_id: string | null = "";
  private pathUrlMembersFlowByTime: string = URLS.MEMBERSFLOWBYTIME;

  constructor(private httpMethods: HttpMethodsService) { }

  ngOnInit() {
    this.getIdGym();
    this.search();
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  search() {
    let formattedBeginDate = this.formatDate(this.beginDate);
    let formattedEndDate = this.formatDate(this.endDate);

    console.log('Data de Início formatada:', formattedBeginDate);
    console.log('Data de Fim formatada:', formattedEndDate);

    const url = `?data_inicio=${formattedBeginDate}&data_fim=${formattedEndDate}&academia=${this.gym_id}`;

    this.httpMethods.get(this.pathUrlMembersFlowByTime + url).subscribe(
      (response: any) => {
        console.log('Resposta do servidor:', response);

        const membersByDay = response.alunos_por_dia;
        const membersByHour = response.alunos_por_hora;

        const days = Object.keys(membersByDay);
        const flowByDay = Object.values(membersByDay);

        const hours = Object.keys(membersByHour);
        const flowByHour = Object.values(membersByHour);

        this.chartOption = {
          tooltip: { trigger: 'axis' },
          legend: { data: ['Fluxo de alunos por dia', 'Fluxo de alunos por hora'] },
          grid: [
            { top: '10%', left: '5%', right: '5%', bottom: '50%' },
            { top: '60%', left: '5%', right: '5%', bottom: '10%' },
          ],
          xAxis: [
            { type: 'category', data: days },
            { type: 'category', data: hours, gridIndex: 1 },
          ],
          yAxis: [
            { type: 'value' },
            { type: 'value', gridIndex: 1 },
          ],
          series: [
            { name: 'Fluxo de alunos por dia', type: 'line', data: flowByDay as number[], smooth: true },
            { name: 'Fluxo de alunos por hora', type: 'line', data: flowByHour as number[], smooth: true, xAxisIndex: 1, yAxisIndex: 1 },
          ],
        };
      },
      (error) => {
        console.error('Erro ao carregar os dados:', error);
      }
    );
  }


}
