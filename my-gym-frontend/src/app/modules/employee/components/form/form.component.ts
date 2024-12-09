import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {URLS} from "../../../../app.urls";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Employee} from "../../interfaces/employee";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  public action: String = "";
  private pathUrlEmployee: string = URLS.USERS;
  protected formGroup: FormGroup;
  private created: boolean = true
  private gymId: string | null = "";
  protected title: string = "Cadastro de Funcionario";

  getGym(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({academia: this.gymId});
    }
  }

  constructor(
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {

    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      tipo_usuario: ['', Validators.required],
      academia: ['']
    });

  }

  ngOnInit() {
    this.getGym()
    this.retriveCallBack();
  }

  cargos = [
    {value: "G", viewValue: "Gerente" },
    {value: "A", viewValue: "Atendente"},
    ]


  public retriveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.title = "Edicao de Funcionario";
        this.httpMethods.get(this.pathUrlEmployee + this.action + '/').subscribe((response: any) => {
          console.log("conteudo do carinha",response);
          this.formGroup.setValue({
            id: response.id,
            nome: response.nome,
            username: response.username,
            password: "",
            tipo_usuario: response.tipo_usuario,
            academia: this.gymId,
          });
        })
      }
    });
  }

  public saveOrUpdate(employee: Employee) {
    if (this.created) {
      let sucessMensagem = 'Funcionario cadastrado'
      this.httpMethods.post(this.pathUrlEmployee, employee).subscribe(() => {
        this.router.navigate(['/employee/list']).then();
        this.snackBar.open(  sucessMensagem, 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
        })
      })
    } else {
      let sucessMensagem = 'Funcionario Atualizado'
      this.httpMethods.patch(this.pathUrlEmployee, employee).subscribe(() => {
        this.router.navigate(['/employee/list']).then();
        this.snackBar.open(  sucessMensagem, 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
        })
      })
    }
  }
}



