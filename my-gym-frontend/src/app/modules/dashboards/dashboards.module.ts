import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {routes} from "./dashboards.routes";
import {NgxEchartsModule} from "ngx-echarts";
import * as echarts from "echarts";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import {MY_DATE_FORMATS} from "./components/date-format";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxEchartsModule.forRoot({ echarts }),
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS,
    },
  ],
})
export class DashboardsModule { }
