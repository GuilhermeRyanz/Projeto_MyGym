import {Routes} from "@angular/router";
import {MembersListComponent} from "./components/members-list/members-list.component";
import {MemberPaymentsComponent} from "./components/member-payments/member-payments.component";

export const routes: Routes = [
  {
    path: "membersListPayments",
    component: MembersListComponent
  },

  {
    path: "memberPayments",
    component: MemberPaymentsComponent
  }

  ]
