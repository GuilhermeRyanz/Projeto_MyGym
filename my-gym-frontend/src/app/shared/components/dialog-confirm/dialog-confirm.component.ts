import {Component, Inject, input} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {CartItem} from "../../interfaces/cartItem";

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardContent,
    MatButton,
    MatDialogClose,
    MatCardModule
  ],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.css'
})
export class DialogConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string},
  ) { }

}
