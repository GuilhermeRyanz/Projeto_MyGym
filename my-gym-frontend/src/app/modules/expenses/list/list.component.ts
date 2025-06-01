import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-list',
  standalone: true,
    imports: [
        CurrencyPipe,
        DatePipe,
        MatButton,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatFormField,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatInput,
        MatLabel,
        MatRow,
        MatRowDef,
        MatTable,
        ReactiveFormsModule
    ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

}
