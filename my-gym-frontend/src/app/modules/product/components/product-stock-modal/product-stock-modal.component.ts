import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {provideEcharts} from "ngx-echarts";
import {MY_DATE_FORMATS} from "../../../dashboards/components/date-format";

@Component({
  selector: 'app-product-stock-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './product-stock-modal.component.html',
  styleUrl: './product-stock-modal.component.css',
  providers: [
    provideEcharts(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

  ]
})
export class ProductStockModalComponent {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private httpMethods: HttpMethodsService,
    protected dialogRef: MatDialogRef<ProductStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { produtoId: number }
  ) {
    this.formGroup = this.fb.group({
      produto: [this.data.produtoId, Validators.required],
      quantidade: [null, Validators.required],
      preco_total: [null, Validators.required],
      data_validade: [""],
    });
  }

  submit() {
    if (this.formGroup.valid) {

      let rawDate = this.formGroup.get('data_validade')?.value;
      let formattedDate = new Date(rawDate).toISOString().split('T')[0]; // <-- agora sim!

      this.formGroup.patchValue({ data_validade: formattedDate });

      this.httpMethods.post('api/produto/lotes/', this.formGroup.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Erro ao abastecer produto:', err)
      });
    }
  }
}
