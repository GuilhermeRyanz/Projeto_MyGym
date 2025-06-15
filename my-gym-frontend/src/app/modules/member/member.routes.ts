import {Routes} from "@angular/router";
import {FormComponent} from "./components/form/form.component";
import {ListComponent} from "./components/list/list.component";
import {WorkoutPlanComponent} from "./components/workout-plan/workout-plan.component";

export const routes: Routes = [
  {
    path: "list",
    component: ListComponent,
  },

  {
    path: "form/:action",
    component: FormComponent
  },

  {
    path: "workout-plan/:action",
    component: WorkoutPlanComponent
  }
]
