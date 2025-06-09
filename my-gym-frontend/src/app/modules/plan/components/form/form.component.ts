import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { URLS } from "../../../../app.urls";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { Plan } from "../../../../shared/interfaces/plan";
import { NgForOf } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatLabel,
    MatError,
    MatButton,
    MatFormField,
    MatInput,
    MatIcon,
    MatSelect,
    MatOption,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  public action: string = "";
  private pathUrlPlan: string = URLS.PLAN;
  formGroup: FormGroup;
  private created: boolean = true;
  private gymId: string | null = "";
  public title: string = "Criação de Plano";

  diasSemana = [
    { label: 'Todos os dias', valor: -1 },
    { label: 'Domingo', valor: 6 },
    { label: 'Segunda', valor: 0 },
    { label: 'Terça', valor: 1 },
    { label: 'Quarta', valor: 2 },
    { label: 'Quinta', valor: 3 },
    { label: 'Sexta', valor: 4 },
    { label: 'Sábado', valor: 5 }
  ];

  constructor(
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', [Validators.required, Validators.maxLength(20)]],
      preco: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      duracao: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(250)]],
      beneficios: this.formBuilder.array([]),
      desconto: [0, [Validators.min(0), Validators.max(100)]],
      dias_permitidos: [[-1]], // Default inicial: "Todos os dias"
      academia: ['']
    });
  }

  toggleDiasPermitidos(selectedDays: number[]): void {
    if (selectedDays.includes(-1)) {
      this.formGroup.get('dias_permitidos')?.setValue([-1]);
    } else {
      const filteredDays = selectedDays.filter(day => day !== -1);
      this.formGroup.get('dias_permitidos')?.setValue(filteredDays);
    }
  }
  get benefits() {
    return this.formGroup.get("beneficios") as FormArray<FormGroup>;
  }

  addBeneficio(): void {
    const item = this.formBuilder.group({
      beneficio: ['', [Validators.maxLength(50)]],
    });

    this.benefits.push(item);
  }

  removeBeneficio(index: number): void {
    this.benefits.removeAt(index);
  }

  ngOnInit() {
    this.getPlan();
    this.retriveCallBack();
  }

  getPlan(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({ academia: this.gymId });
    }
  }

  retriveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.title = "Edição de Plano";
        this.httpMethods.get(`${this.pathUrlPlan}${this.action}/`).subscribe((response: any) => {
          this.benefits.clear();

          if (Array.isArray(response.beneficios)) {
            response.beneficios.forEach((beneficio: string) => {
              this.benefits.push(this.formBuilder.group({
                beneficio: [beneficio, [Validators.maxLength(50)]]
              }));
            });
          }

          this.formGroup.patchValue({
            id: response.id,
            nome: response.nome,
            preco: response.preco,
            duracao: response.duracao,
            descricao: response.descricao,
            desconto: response.desconto,
            academia: this.gymId,
            dias_permitidos: Array.isArray(response.dias_permitidos)
              ? response.dias_permitidos.map(Number)
              : []
          });
        });
      }
    });
  }

  saveOrUpdate(plan: Plan): void {
    plan.beneficios = this.benefits.value
      .map((b: any) => b.beneficio)
      .filter((beneficio: string) => beneficio.trim() !== "");

    const diasPermitidos = this.formGroup.get('dias_permitidos')?.value;
    const payload = {
      ...plan,
      academia: Number(this.gymId),
      preco: parseFloat(plan.preco.toString()),
      desconto: parseFloat(plan.desconto.toString()),
      dias_permitidos: diasPermitidos.includes(-1)
        ? [0, 1, 2, 3, 4, 5, 6]
        : diasPermitidos.map(Number)
    };

    if (this.created) {
      this.httpMethods.post(this.pathUrlPlan, payload).subscribe(() => {
        this.router.navigate(['/plan/list']).then();
      });
    } else {
      this.httpMethods.patch(`${this.pathUrlPlan}`, payload).subscribe(() => {
        this.router.navigate(['/plan/list']).then();
      });
    }
  }
}
