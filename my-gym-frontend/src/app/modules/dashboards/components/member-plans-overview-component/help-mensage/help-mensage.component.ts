import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-help-mensage',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  template:`
    <h1 mat-dialog-title>Gráfico de distribuição de alunos por plano </h1>
    <div mat-dialog-content>Esse grafico mostram a quantidade de alunos dividos por planos ativos na academia.</div>
    <div mat-dialog-actions>
    </div>
  `,
  styleUrl: './help-mensage.component.css'
})
export class HelpMensageComponent {}
