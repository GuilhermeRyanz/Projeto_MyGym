import {Routes} from "@angular/router";
import {ListComponent} from "./components/list/list.component";
import {FormComponent} from "./components/form/form.component";


export const routes: Routes = [
  {
    path: "list",
    component: ListComponent
  },

  {
    path: "form/:action",
    component: FormComponent
  }
]
