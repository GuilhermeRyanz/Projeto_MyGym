import {Component, Inject, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {URLS} from "../../../app.urls";
import {HttpMethodsService} from "../../../shared/services/httpMethods/http-methods.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../auth/services/auth.service";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {provideEcharts} from "ngx-echarts";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MY_DATE_FORMATS} from "../../dashboards/components/date-format";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TitleCasePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatSelect,
    MatOption,
    MatError,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    TitleCasePipe,
    MatButton
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [
    provideEcharts(),
    provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class FormComponent implements OnInit {
  private readonly pathUrl: string = URLS.EXPENSE;
  protected readonly categories: string[] = ['energia', 'agua', 'salario', 'manutencao', 'produtos', 'limpeza', 'impostos', 'outros'];
  public formGroup: FormGroup;
  public create: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private httpMethods: HttpMethodsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = this.formBuilder.group({
      id: [""],
      tipo: [data.expense?.categoria || null, Validators.required],
      descricao: [data.expense?.descricao || null, Validators.required],
      valor: [data.expense?.valor || null, Validators.required],
      academia: [this.authService.get_gym()],
      data: [data.expense?.data || null]
    });
  }

  ngOnInit() {
    this.retriverCallBack()
  }

  public retriverCallBack(): void {
    if (this.data.action == 'update') {
      this.create = false;
      this.httpMethods.get(this.pathUrl + this.data.expense.id + '/').subscribe((response: any) => {
          this.formGroup.setValue({
            id: response.id,
            tipo: response.tipo,
            descricao: response.descricao,
            data: response.data,
            valor: response.valor,
            academia: this.authService.get_gym()
          });
        }
      )
    }
  }

  public register(): void {
    if (this.formGroup.valid && this.data.action == "create") {
      this.httpMethods.post(this.pathUrl, this.formGroup.value).subscribe(
        response => {
          this.snackBar.open("Gasto registrado com sucesso.", 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open("Erro ao registrar gasto.", 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
      );
    } else {
      this.httpMethods.patch(this.pathUrl, this.formGroup.value).subscribe(
        response => {
          this.snackBar.open("Atualizado registrado com sucesso.", 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open("Erro ao atualizar registro gasto.", 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
      )

    }

  }

  public closeDialog(): void {
    this.formGroup.reset();
    this.dialogRef.close();
  }
}
