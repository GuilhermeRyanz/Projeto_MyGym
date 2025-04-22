import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
      data_validade: [null],
    });
  }

  submit() {
    if (this.formGroup.valid) {
      this.httpMethods.post('api/produto/lotes/', this.formGroup.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Erro ao abastecer produto:', err)
      });
    }
  }
}
