import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {HomeFuncionarioComponent} from "./home-funcionario/home-funcionario.component";

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  // {
  //   path: '',
  //   redirectTo: 'auth/login',
  //   pathMatch: 'full',
  // },

  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: `home/funcionario`,
    component: HomeFuncionarioComponent
  }

];
