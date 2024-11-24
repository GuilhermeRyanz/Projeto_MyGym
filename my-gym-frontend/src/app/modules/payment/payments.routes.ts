import {Routes} from "@angular/router";
import {PaymentRegistrationComponent} from "./components/payment-registration/payment-registration.component";
import {PaymentConfirmComponent} from "./components/payment-confirm/payment-confirm.component";

export const routes: Routes = [
  {
    path: "paymentRegistration",
    component: PaymentRegistrationComponent,
  },

  {
    path: "paymentConfirm",
    component: PaymentConfirmComponent
  }
]
