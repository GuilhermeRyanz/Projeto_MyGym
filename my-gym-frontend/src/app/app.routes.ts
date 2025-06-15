import {Routes} from '@angular/router';
import {AuthGuardService} from './guard/auth-guard.service';
import {MainComponent} from './main/main.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'my_gym/home', pathMatch: 'full' },

      {
        path: 'MemberArea',
        loadChildren: () =>
          import('./modules/member-area/member-area.module').then(m => m.MemberAreaModule),
        canActivate: [AuthGuardService]
      },

      { path: 'adm',      loadChildren: () => import('./modules/gym-list/gym-list.module').then(m => m.GymListModule) },
      { path: 'my_gym',   loadChildren: () => import('./modules/home-gym/home-gym.module').then(m => m.HomeGymModule) },
      { path: 'employee', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'plan',     loadChildren: () => import('./modules/plan/plan.module').then(m => m.EmployeeModule) },
      { path: 'member',   loadChildren: () => import('./modules/member/member.module').then(m => m.MemberModule) },
      { path: 'payment',  loadChildren: () => import('./modules/payment/payment.module').then(m => m.PaymentModule) },
      { path: 'check-in', loadChildren: () => import('./modules/check-in/check-in.module').then(m => m.CheckInModule) },
      { path: 'dashboards', loadChildren: () => import('./modules/dashboards/dashboards.module').then(m => m.DashboardsModule) },
      { path: 'payments',   loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule) },
      { path: 'product',    loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule) },
      { path: 'chat',       loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule) },
      { path: 'expense',    loadChildren: () => import('./modules/expenses/expenses.module').then(m => m.ExpensesModule) },
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
