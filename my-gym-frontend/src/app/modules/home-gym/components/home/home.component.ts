import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Novo

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTooltipModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicionar schema
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public tipo_usuario = localStorage.getItem('tipo_usuario');

  public navigationOptions: Array<{
    title: string;
    description: string;
    route: string;
    icon: string;
    tooltip: string;
  }> = [];

  private allOptions = [
    {
      title: 'Cadastro de Alunos',
      description: 'Adicione novos alunos à academia.',
      route: 'member/form/create',
      icon: 'person_add',
      tooltip: 'Gerenciar cadastro de alunos',
      roles: ['D', 'G', 'A']
    },
    {
      title: 'Gerenciar Planos',
      description: 'Crie e edite planos de adesão.',
      route: 'plan/list',
      icon: 'fitness_center',
      tooltip: 'Criar ou editar planos',
      roles: ['D', 'G']
    },
    {
      title: 'Meus Planos',
      description: 'Veja os planos ativos.',
      route: 'plan/list',
      icon: 'checklist',
      tooltip: 'Visualizar planos ativos',
      roles: ['A']
    },
    {
      title: 'Pagamentos',
      description: 'Registre os pagamentos dos alunos.',
      route: 'payment/paymentRegistration',
      icon: 'payment',
      tooltip: 'Registrar pagamentos',
      roles: ['D', 'G', 'A']
    },
    {
      title: 'Funcionários',
      description: 'Cadastre e gerencie os funcionários.',
      route: 'employee/list',
      icon: 'group',
      tooltip: 'Gerenciar funcionários',
      roles: ['D', 'G']
    },
    {
      title: 'Check-in',
      description: 'Realize o check-in de um aluno.',
      route: 'check-in/register',
      icon: 'login',
      tooltip: 'Registrar entrada de alunos',
      roles: ['D', 'G', 'A']
    },
    {
      title: 'Academias',
      description: 'Selecione outra academia.',
      route: 'adm/gym/list',
      icon: 'store',
      tooltip: 'Gerenciar academias',
      roles: ['D']
    },
    {
      title: 'Dashboards',
      description: 'Veja gráficos referentes ao desempenho da academia.',
      route: 'dashboards/dashboard',
      icon: 'bar_chart',
      tooltip: 'Visualizar desempenho',
      roles: ['D', 'G']
    },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    if (this.tipo_usuario) {
      this.navigationOptions = this.allOptions.filter(option => option.roles.includes(this.tipo_usuario!));
    } else {
      console.warn('tipo_usuario não encontrado no localStorage');
    }
  }
}
