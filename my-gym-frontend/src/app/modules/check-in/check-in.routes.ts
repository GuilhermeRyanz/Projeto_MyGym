import {Routes} from "@angular/router";
import {CheckInConfirmComponent} from "./components/check-in-confirm/check-in-confirm.component";
import {CheckInRegistrationComponent} from "./components/check-in-registration/check-in-registration.component";

export const routes: Routes = [
  {
    path: "confirm",
    component: CheckInConfirmComponent,

  },

  {
    path: "register",
    component: CheckInRegistrationComponent
  }

]
