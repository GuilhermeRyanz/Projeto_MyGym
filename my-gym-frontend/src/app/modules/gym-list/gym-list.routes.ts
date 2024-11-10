import {Routes} from "@angular/router";
import {ListComponent} from './components/list/list.component';
import {FormGymComponent} from "./components/form-gym/form-gym.component";


export const routes: Routes = [
  {
    path: "gym/list",
    component: ListComponent
  },

  {
    path: "form/:action",
    component: FormGymComponent
  }
]
