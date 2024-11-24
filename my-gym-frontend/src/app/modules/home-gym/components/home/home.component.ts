import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatToolbar],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  navigationOptions = [
    { title: 'Cadastro de Alunos', description: 'Adicione novos alunos à academia.', route: 'member/form/create' },
    { title: 'Gerenciamento de Planos', description: 'Crie e edite planos de adesão.', route: 'plan/list' },
    { title: 'Pagamentos', description: 'Registre e gerencie os pagamentos dos alunos.', route: 'payment/paymentRegistration' },
    { title: 'Funcionários', description: 'Cadastre e gerencie os funcionários.', route: 'employee/list' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }



}
