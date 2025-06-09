import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";

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
export class DialogConfirmComponent implements AfterViewInit {
  @ViewChild('cancelButton') cancelButton!: ElementRef<HTMLButtonElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) {}

  ngAfterViewInit() {
    this.cancelButton.nativeElement.focus();
  }
}
