import {Component, Inject, OnInit} from '@angular/core';
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {URLS} from "../../../../app.urls";
import {DatePipe, DecimalPipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";


@Component({
  selector: 'app-member-payments',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    DatePipe,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
    NgIf,
    MatIcon,
    MatCard,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './member-payments.component.html',
  styleUrl: './member-payments.component.css'
})
export class MemberPaymentsComponent implements OnInit {

  public memberInfo: MemberPlan | undefined;
  public payments = new MatTableDataSource<any>();
  public displayedColumns: string[] = ['valor', 'data_pagamento', 'tipo_pagamento', 'plano_nome'];
  public urlPathPayments: string = URLS.PAYMENT

  constructor(
    public dialogRef: MatDialogRef<MemberPaymentsComponent>,
    public httpMethods: HttpMethodsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.memberInfo = data?.memberInfo || {};
  }

  fechar(): void{
    this.dialogRef.close();
  }

  ngOnInit() {
    this.payments_seach()
  }

  public payments_seach(): void {
    this.httpMethods.get(this.urlPathPayments+ `?aluno=${this.memberInfo?.aluno?.id}&academia=${this.memberInfo?.plano?.academia}`).subscribe((response: any) => {
      this.payments = response;
    });
  };

}
