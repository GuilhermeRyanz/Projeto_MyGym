import {Routes} from "@angular/router";
import { ListComponent } from "./list/list.component";
import { FormComponent } from "./form/form.component";


export const routes: Routes = [

  {
    path: "list",
    component: ListComponent
  },

  {
    path: "create",
    component: FormComponent
  }


]
