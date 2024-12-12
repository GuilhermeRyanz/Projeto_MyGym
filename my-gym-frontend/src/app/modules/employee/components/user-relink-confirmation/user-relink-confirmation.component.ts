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
    <div mat-dialog-content>Já existe um usuario com esse email cadastrado em uma academia, Deseja vincular esse usuario a essa academia? (Ele não podera acessar o sistema da academia anterior)</div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Confirmar</button>
    </div>
  `,
  styleUrl: './user-relink-confirmation.component.css'
})
export class UserRelinkConfirmationComponent {

}
