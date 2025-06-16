import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { URLS } from '../../../../app.urls';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-product-stock-ajuste',
  templateUrl: './product-stock-ajuste.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatInput,
    MatLabel,
    NgIf,
    MatError
  ],
  styleUrls: ['./product-stock-ajuste.component.css']
})
export class ProductStockAjusteComponent {
  form: FormGroup;
  clickCount = 0;
  maxClicks = 3;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private httpMethods: HttpMethodsService,
    private dialogRef: MatDialogRef<ProductStockAjusteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { produtoId: number }
  ) {
    this.form = this.fb.group({
      quantidade: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onConfirmClick() {
    if (this.form.invalid) {
      return;
    }

    this.clickCount++;

    if (this.clickCount < this.maxClicks) {
      return;
    }

    this.loading = true;
    const body = {
      produto_id: this.data.produtoId,
      quantidade: this.form.value.quantidade,
    };

    this.httpMethods.post(`${URLS.PRODUCT}baixar_estoque/`, body)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.dialogRef.close({ estoqueAjustado: true });
        },
        error: (error) => {
          this.loading = false;
          alert(error.error?.erro || 'Erro ao ajustar estoque');
          this.clickCount = 0;
        }
      });
  }

  onCancel() {
    this.dialogRef.close({ estoqueAjustado: false });
  }
}
