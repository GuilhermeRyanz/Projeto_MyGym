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
    <h1 mat-dialog-title>Graficos de alunos por dia e hora</h1>
    <div mat-dialog-content>Esse grafico mostram a quantidade de alunos com base na hora e nos dias que realizou seu check-in.</div>
    <div mat-dialog-actions>
    </div>
  `,
  styleUrl: './help-mensage.component.css'
})
export class HelpMensageComponent {

}
