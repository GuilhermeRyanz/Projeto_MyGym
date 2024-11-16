import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Employee} from "../../../employee/interfaces/employee";
import {Plan} from "../../../plan/interfaces/plan";
import {response} from "express";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
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
  protected plans: Plan[] = [];
  private pathUrlMember: string = URLS.MEMBER;
  private pathUrlPlan: string = URLS.PLAN
  formGroup: FormGroup;
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
      telefone: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      email: ['', [Validators.required, Validators.email]],
      data_nascimento: ['', Validators.required],
      academia: this.gymId,
      matricula: [],
      plano: ['', Validators.required]
    });

  }

  ngOnInit(){

    this.getGym()

    this.httpMethods.get(this.pathUrlPlan + `?academia=${this.gymId}`).subscribe((response: any) => {
      this.plans = response
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.httpMethods.get(this.pathUrlMember + this.action + '/').subscribe((response: any) => {
          this.formGroup.setValue({
            id: response.id,
            nome: response.nome,
            email: response.email,
            telefone: response.telefone,
            data_nascimento: response.date_nascimento,
            matricula: response.matricula,
            plano: response.plano.id

          });
        })
      }
    });
  }

  public saveOrUpdate(employee: Employee) {
    if (this.created) {
      this.httpMethods.post(this.pathUrlMember, employee).subscribe(() => {
        this.router.navigate(['/member/list']).then();
      })
    } else {
      this.httpMethods.patch(this.pathUrlMember, employee).subscribe(() => {
        this.router.navigate(['/member/list']).then();
      })
    }
  }



}
