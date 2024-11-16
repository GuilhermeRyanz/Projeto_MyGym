import {Routes} from "@angular/router";
import {FormComponent} from "./components/form/form.component";
import {ListComponent} from "./components/list/list.component";


export const routes: Routes = [
  {
    path: "list",
    component: ListComponent,
  },

  {
    path: "form/:action",
    component: FormComponent
  }
]
