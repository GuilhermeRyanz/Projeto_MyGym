import {Component} from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-confirm-dialog-component',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  template:`
    <h1 mat-dialog-title>Confirmação</h1>
    <div mat-dialog-content>Voce tem certeza de que deseja excluir esse plano?</div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Confirmar</button>
    </div>
  `,

  styleUrl: './confirm-dialog-component.component.css'
})
export class ConfirmDialogComponentComponent {

}
