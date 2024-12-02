import { Component } from '@angular/core';
import {
  MembersFlowByTimeComponentComponent
} from "../members-flow-by-time-component/members-flow-by-time-component.component";
import {MatListSubheaderCssMatStyler} from "@angular/material/list";
import {
  MemberPlansOverviewComponentComponent
} from "../member-plans-overview-component/member-plans-overview-component.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MembersFlowByTimeComponentComponent,
    MatListSubheaderCssMatStyler,
    MemberPlansOverviewComponentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
