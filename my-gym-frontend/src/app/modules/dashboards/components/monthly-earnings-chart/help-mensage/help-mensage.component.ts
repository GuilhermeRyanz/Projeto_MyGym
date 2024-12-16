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
    <h1 mat-dialog-title>Grafico de ganhos mensais</h1>
    <div mat-dialog-content>Este gráfico mostra a receita arrecadada por cada um dos planos em um determinado mês. Selecione o mês e o ano que deseja consultar.</div>
    <div mat-dialog-actions>
    </div>
  `,
  styleUrl: './help-mensage.component.css'
})
export class HelpMensageComponent {

}
