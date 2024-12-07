import {Component, LOCALE_ID, OnInit} from '@angular/core';
import { URLS } from "../../../../app.urls";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxEchartsDirective } from "ngx-echarts";
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-monthly-earnings-chart',
  standalone: true,
  imports: [
    MatCard,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsDirective,
    MatNativeDateModule,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatDatepickerModule,
    DatePipe
  ],
  templateUrl: './monthly-earnings-chart.component.html',
  styleUrl: './monthly-earnings-chart.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]

})
export class MonthlyEarningsChartComponent implements OnInit {

  public gym_id: string | null = "";
  private pathUrlMonthltlyEarnings: string = URLS.MONTHLYEARNINGSCHARTS;
  public chartOption: any;
  public data: Date = new Date();

  constructor(private httpMethods: HttpMethodsService,) { }

  ngOnInit() {
    this.getIdGym();
    this.search();
  }

  setMonthAndYear(event: Date, datepicker: any): void {
    this.data = event;
    datepicker.close();
    this.search();
  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  search(): void {
    const formattedDate = this.data.toISOString().slice(0, 7);
    this.httpMethods.get(this.pathUrlMonthltlyEarnings + `?month=${formattedDate}&academia=${this.gym_id}`).subscribe(
      response => {
        const data = response.data;

        this.chartOption = {
          title: {
            text: `Ganhos Mensais por Plano (${formattedDate})`,
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: R$ {c}'
          },
          xAxis: {
            type: 'category',
            data: data.map((item: any) => item.planos),
            name: 'Planos',
            nameLocation: 'middle',
            nameTextStyle: {
              fontSize: 14,
              padding: 20
            }
          },
          yAxis: {
            type: 'value',
            name: 'Receita (R$)',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: 14,
              padding: 10
            }
          },
          series: [
            {
              data: data.map((item: any) => item.total),
              type: 'bar',
              name: 'Ganhos',
              itemStyle: {
                color: '#68c86c'
              }
            }
          ]
        };
      }
    );
  }
}
