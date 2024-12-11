import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-user-relink-confirmation',
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
    <div mat-dialog-content>Voce tem certeza de que deseja excluir esse funcionario? Ele não podera acessar novamente o sistema da academia</div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Confirmar</button>
    </div>
  `,
  styleUrl: './user-relink-confirmation.component.css'
})
export class UserRelinkConfirmationComponent {

}
