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
    <h1 mat-dialog-title>Confirmação</h1>
    <div mat-dialog-content>Esse grafico mostram a quantidade de alunos com base na hora e no dias que realizou seu chack</div>
    <div mat-dialog-actions>
      <button mat-button color="warn" [mat-dialog-close]="true">Ok</button>
    </div>
  `,
  styleUrl: './help-mensage.component.css'
})
export class HelpMensageComponent {

}
