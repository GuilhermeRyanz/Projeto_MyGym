import {Routes} from '@angular/router';
import {AuthGuardService} from "./guard/auth-guard.service";
import {MainComponent} from "./main/main.component";

export const routes: Routes = [


  {
    path: '',
    component: MainComponent,
    children: [

      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      },

      {
        path: 'adm',
        loadChildren: () => import('./modules/gym-list/gym-list.module').then(m => m.GymListModule),
        canActivate: [AuthGuardService]
      },

      {
        path: 'my_gym',
        loadChildren: () => import('./modules/home-gym/home-gym.module').then(m => m.HomeGymModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "employee",
        loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "plan",
        loadChildren: () => import('./modules/plan/plan.module').then(m => m.EmployeeModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "member",
        loadChildren: () => import('./modules/member/member.module').then(m => m.MemberModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "payment",
        loadChildren: () => import('./modules/payment/payment.module').then(m => m.PaymentModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "check-in",
        loadChildren: () => import('./modules/check-in/check-in.module').then(m => m.CheckInModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "",
        redirectTo: "my_gym/home",
        pathMatch: "full",
      },

      {
        path: "dashboards",
        loadChildren: () => import('./modules/dashboards/dashboards.module').then(m => m.DashboardsModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "payments",
        loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule),
        canActivate: [AuthGuardService]
      },

      {
        path: "product",
        loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule),
        canActivate: [AuthGuardService]

      },
      {
        path: "MemberArea",
        loadChildren: () => import('./modules/member-area/member-area.module').then(m => m.MemberAreaModule),
      }
    ],
  },


];
