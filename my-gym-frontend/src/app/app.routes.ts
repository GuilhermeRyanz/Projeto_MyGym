import {Routes} from '@angular/router';
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },

  {
    path: 'adm',
    loadChildren: () => import('./modules/gym-list/gym-list.module').then(m => m.GymListModule),
  }

];
