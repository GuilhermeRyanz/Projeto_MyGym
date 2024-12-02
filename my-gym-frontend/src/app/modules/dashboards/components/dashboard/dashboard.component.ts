import { Component } from '@angular/core';
import {
  MembersFlowByTimeComponentComponent
} from "../members-flow-by-time-component/members-flow-by-time-component.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MembersFlowByTimeComponentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
