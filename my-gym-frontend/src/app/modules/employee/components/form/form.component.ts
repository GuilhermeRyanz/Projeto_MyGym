import { Component, OnInit } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { URLS } from "../../../../app.urls";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { Employee } from "../../../../shared/interfaces/employee";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { UserRelinkConfirmationComponent } from "../user-relink-confirmation/user-relink-confirmation.component";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatError
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  public action: String = "";
  private pathUrlEmployee: string = URLS.USERS;
  protected formGroup: FormGroup;
  private created: boolean = true;
  private gymId: string | null = "";
  protected title: string = "Cadastro de funcionário";

  getGym(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({ academia: this.gymId });
    }
  }

  constructor(
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: [''],
      tipo_usuario: ['', Validators.required],
      academia: ['']
    });
  }

  ngOnInit() {
    this.getGym();
    this.retriveCallBack();
  }

  cargos = [
    { value: "G", viewValue: "Gerente" },
    { value: "A", viewValue: "Atendente" },
  ];

  public retriveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (this.created) {
        this.formGroup.get('password')?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$')
        ]);
      } else {
        this.formGroup.get('password')?.clearValidators();
      }
      this.formGroup.get('password')?.updateValueAndValidity();

      if (!this.created) {
        this.title = "Edição de funcionário";
        this.httpMethods.get(this.pathUrlEmployee + this.action + '/').subscribe((response: any) => {
          this.formGroup.setValue({
            id: response.id,
            nome: response.nome,
            username: response.username,
            password: "",
            tipo_usuario: response.tipo_usuario,
            academia: this.gymId,
          });
        });
      }
    });
  }

  public saveOrUpdate(employee: Employee) {
    // Criar uma cópia do employee e remover password se vazio na edição
    let payload = { ...employee };
    if (!this.created && !payload.password) {
      delete payload.password; // Remove o campo password do payload se vazio na edição
    }

    if (this.created) {
      this.httpMethods.get(this.pathUrlEmployee + `?email=${payload.username}`).subscribe((response: any) => {
        if (response && response.results.length > 0) {
          const dialogoRef = this.dialog.open(UserRelinkConfirmationComponent);
          dialogoRef.afterClosed().subscribe(result => {
            if (result) {
              const usuario = response.results[0].id;
              const newBody = { ...payload, usuario: usuario };
              this.httpMethods.post(this.pathUrlEmployee + 'alterar_academia/', newBody).subscribe(() => {
                this.router.navigate(['/employee/list']);
              });
            }
          });
        } else {
          let sucessMensagem = 'Funcionario cadastrado';
          this.httpMethods.post(this.pathUrlEmployee, payload).subscribe(() => {
            this.router.navigate(['/employee/list']).then();
            this.snackBar.open(sucessMensagem, 'Fechar', {
              duration: 5000,
              verticalPosition: 'top',
            });
          });
        }
      });
    } else {
      let sucessMensagem = 'Funcionario Atualizado';
      this.httpMethods.patch(this.pathUrlEmployee, payload).subscribe(() => {
        this.router.navigate(['/employee/list']).then();
        this.snackBar.open(sucessMensagem, 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
        });
      });
    }
  }
}
