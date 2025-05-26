import {Routes} from "@angular/router";
import {ListComponent} from "../member/components/list/list.component";
import {FormComponent} from "../member/components/form/form.component";
import {MemberAreaMainComponent} from "./member-area-main/member-area-main.component";

export const routes: Routes = [
  {
    path: "main",
    component: MemberAreaMainComponent,
  },
]
