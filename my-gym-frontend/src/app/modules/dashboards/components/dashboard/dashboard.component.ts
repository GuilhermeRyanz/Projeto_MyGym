import { Component } from '@angular/core';
import {
  MembersFlowByTimeComponentComponent
} from "../members-flow-by-time-component/members-flow-by-time-component.component";
import {MatListSubheaderCssMatStyler} from "@angular/material/list";
import {
  MemberPlansOverviewComponentComponent
} from "../member-plans-overview-component/member-plans-overview-component.component";
import {MonthlyEarningsChartComponent} from "../monthly-earnings-chart/monthly-earnings-chart.component";
import {
  PlansWithNewMembersComponentComponent
} from "../plans-with-new-members-component/plans-with-new-members-component.component";
import {MonthBalanceComponent} from "../month-balance/month-balance.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MembersFlowByTimeComponentComponent,
    MatListSubheaderCssMatStyler,
    MemberPlansOverviewComponentComponent,
    MonthlyEarningsChartComponent,
    PlansWithNewMembersComponentComponent,
    MonthBalanceComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}

