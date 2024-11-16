import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {URLS} from "../../../../app.urls";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Plan} from "../../interfaces/plan";

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
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  public action: String = "";
  private pathUrlPlan: string = URLS.PLAN;
  formGroup: FormGroup;
  private created: boolean = true
  private gymId: string | null = "";

  getPlan(): void {
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
      preco: ['', Validators.required],
      duracao: ['', Validators.required],
      descricao: ['', Validators.required],
      academia: ['']
    });

  }

  ngOnInit() {
    this.getPlan()
    this.retriveCallBack();
  }

  public retriveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.httpMethods.get(this.pathUrlPlan + this.action + '/').subscribe((response: any) => {
          this.formGroup.setValue({
            id: response.id,
            nome: response.nome,
            preco: response.preco,
            duracao: response.duracao,
            descricao: response.descricao,
            academia: this.gymId,
          });
        })
      }
    });
  }

  public saveOrUpdate(plan: Plan): void {
    if (this.created){
      this.httpMethods.post(this.pathUrlPlan, plan).subscribe(() => {
        this.router.navigate(['/plan/list']).then();
      })
    } else {
      this.httpMethods.patch(this.pathUrlPlan, plan).subscribe(() => {
        this.router.navigate(['/plan/list']).then();
      })
    }
  }



}



