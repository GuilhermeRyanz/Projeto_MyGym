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
  ) {

    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', Validators.required],
      username: ['', Validators.required],
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
        this.httpMethods.get(this.pathUrlEmployee + this.action + '/').subscribe((response: any) => {
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
      this.httpMethods.post(this.pathUrlEmployee, employee).subscribe(() => {
        this.router.navigate(['/employee/list']).then();
      })
    } else {
      this.httpMethods.patch(this.pathUrlEmployee, employee).subscribe(() => {
        this.router.navigate(['/employee/list']).then();
      })
    }
  }


}



