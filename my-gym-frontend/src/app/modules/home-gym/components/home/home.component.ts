import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
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
    { title: 'Pagamentos', description: 'Registre os pagamentos dos alunos.', route: 'payment/paymentRegistration' },
    { title: 'Funcionários', description: 'Cadastre e gerencie os funcionários.', route: 'employee/list' },
    { title: 'Check-in', description: 'Realize o check-in de um aluno', route: 'check-in/register' },
    { title: 'Academias', description: 'Selecione outra academia', route: 'adm/gym/list' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }



}
