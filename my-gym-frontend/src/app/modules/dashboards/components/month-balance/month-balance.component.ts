import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { URLS } from '../../../../app.urls';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {CurrencyPipe, DatePipe, NgClass, NgIf, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-month-balance',
  standalone: true,
  templateUrl: './month-balance.component.html',
  styleUrls: ['./month-balance.component.scss'],
  imports: [
    NgxEchartsDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatDatepicker,
    MatDatepickerToggle,
    MatInput,
    DatePipe,
    MatDatepickerInput,
    ReactiveFormsModule,
    TitleCasePipe,
    NgClass,
    CurrencyPipe,
    NgIf
  ]
})
export class MonthBalanceComponent implements OnInit {
  mainChartOptions: EChartsOption = {};
  detailChartOptions: EChartsOption = {};
  dateControl = new FormControl(new Date());
  data: any = {
    mensalidades: { total: 0, detalhamento: [] },
    vendas: { total: 0, detalhamento: [] },
    gastos: { total: 0, detalhamento: [] },
    'balanço mensal': { total: 0 }
  };

  constructor(
    private httpMethods: HttpMethodsService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('pt-BR'); // Configura locale para pt-BR
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const date = this.dateControl.value!;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthYear = `${year}-${month}`;
    const academia = this.authService.get_gym();
    this.httpMethods.get(`${URLS.GYM}month_balance/?data=${monthYear}&academia=${academia}`).subscribe({
      next: (data: any) => {
        this.data = {
          mensalidades: data.mensalidades || { total: 0, detalhamento: [] },
          vendas: data.vendas || { total: 0, detalhamento: [] },
          gastos: data.gastos || { total: 0, detalhamento: [] },
          'balanço mensal': data['balanço mensal'] || { total: 0 }
        };
        this.updateMainChart();
      },
      error: (err) => {
        console.error('Erro ao buscar dados:', err);
      }
    });
  }

  updateMainChart() {
    this.mainChartOptions = {
      title: { text: 'Resumo Financeiro' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['Mensalidades', 'Vendas', 'Gastos']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Total',
          type: 'bar',
          data: [
            this.data.mensalidades.total || 0,
            this.data.vendas.total || 0,
            this.data.gastos.total || 0
          ],
          itemStyle: {
            color: (params) => ['#1890ff', '#13c2c2', '#f5222d'][params.dataIndex]
          }
        }
      ]
    };
  }

  onChartClick(event: any) {
    const category = event.name.toLowerCase();
    let detailData: any[] = [];
    let labels: string[] = [];
    let title = '';

    if (category === 'mensalidades') {
      detailData = this.data.mensalidades.detalhamento || [];
      labels = detailData.map((item) => item.aluno_plano__plano__nome || 'Sem Nome');
      title = 'Detalhamento de Mensalidades';
    } else if (category === 'vendas') {
      detailData = this.data.vendas.detalhamento || [];
      labels = detailData.map((item) => item.produto__categoria || 'Sem Categoria');
      title = 'Detalhamento de Vendas';
    } else if (category === 'gastos') {
      detailData = this.data.gastos.detalhamento || [];
      labels = detailData.map((item) => item.tipo || 'Sem Tipo');
      title = 'Detalhamento de Gastos';
    }

    this.detailChartOptions = {
      title: { text: detailData.length ? title : `${title} (Sem Dados)` },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: labels },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Total',
          type: 'bar',
          data: detailData.map((item) => item.total || 0),
          itemStyle: { color: '#1890ff' }
        }
      ]
    };
  }

  onMonthSelected(event: any, picker: MatDatepicker<Date>) {
    const date = new Date(event);
    this.dateControl.setValue(date);
    picker.close();
    this.fetchData();
  }

  onDateChange() {
    this.fetchData();
  }
}
