import {Component, OnInit} from '@angular/core';
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
export class HomeComponent implements OnInit {


  public tipo_usuario= localStorage.getItem('tipo_usuario');

  public navigationOptions: Array<{ title: string; description: string; route: string }> = [];

  private allOptions = [
    { title: 'Cadastro de Alunos', description: 'Adicione novos alunos à academia.', route: 'member/form/create', roles: ['D','G','A']},
    { title: 'Planos', description: 'Crie e edite planos de adesão.', route: 'plan/list', roles: ['D', 'G'] },
    { title: 'Planos', description: 'Veja os planos ativos', route: 'plan/list', roles: ['A'] },
    { title: 'Pagamentos', description: 'Registre os pagamentos dos alunos.', route: 'payment/paymentRegistration', roles: ['D','G','A'] },
    { title: 'Funcionários', description: 'Cadastre e gerencie os funcionários.', route: 'employee/list', roles: ['D', 'G'] },
    { title: 'Check-in', description: 'Realize o check-in de um aluno.', route: 'check-in/register', roles: ['D','G','A'] },
    { title: 'Academias', description: 'Selecione outra academia.', route: 'adm/gym/list', roles: ['D'] },
    { title: 'Dashboards', description: 'Veja graficos referentes ao desenpenho da academia.', route: 'dashboards/dashboard', roles: ['D', 'G'] },

  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    if (this.tipo_usuario){
      this.navigationOptions = this.allOptions.filter(option => option.roles.includes(this.tipo_usuario!));
    }
  }


}
