import {Routes} from '@angular/router';
import {AuthGuardService} from "./guard/auth-guard.service";
export const routes: Routes = [
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
  }

];
