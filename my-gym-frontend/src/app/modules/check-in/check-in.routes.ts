import {Routes} from "@angular/router";
import {CheckInConfirmComponent} from "./components/check-in-confirm/check-in-confirm.component";
import {CheckInRegistrationComponent} from "./components/check-in-registration/check-in-registration.component";
import {TotemComponent} from "./components/totem/totem.component";

export const routes: Routes = [
  {
    path: "confirm",
    component: CheckInConfirmComponent,

  },

  {
    path: "register",
    component: CheckInRegistrationComponent
  },

  {
    path: "totem", // ✅ Rota para acessar o TotemComponent pela URL
    component: TotemComponent,
  }
]
