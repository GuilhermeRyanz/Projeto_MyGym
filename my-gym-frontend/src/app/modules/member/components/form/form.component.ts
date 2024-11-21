import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Plan} from "../../../plan/interfaces/plan";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MemberPlanComponent} from "../member-plan/member-plan.component";
import {Member} from "../../interfaces/member";

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
    MatOption,
    MatTabGroup,
    MatTab,
    MemberPlanComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public obj?: Member = undefined;
  private originalPlanId: number = 0;
  public action: string = "";
  protected plans: Plan[] = [];
  private pathUrlMember: string = URLS.MEMBER;
  private pathUrlPlan: string = URLS.PLAN;
  private pathUrlMemberPlan: string = URLS.MEMBERPLAN;
  formGroup: FormGroup;
  private created: boolean = true;
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
      academia: [null],
      matricula: [],
    });
  }

  ngOnInit() {
    this.getGym();
    this.httpMethods.get(this.pathUrlPlan + `?academia=${this.gymId}&active=true`).subscribe((response: any) => {
      this.plans = response;
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.httpMethods.get(this.pathUrlMember + `${this.action}/`).subscribe((response: any) => {
          this.obj = response
          console.log(response[0])
          this.formGroup.setValue({
            id: response.id,
            nome: response.nome,
            email: response.email,
            telefone: response.telefone,
            data_nascimento: response.data_nascimento,
            matricula: response.matricula,
            academia: this.gymId,
          });
        });
      }
    });
  }

  public saveOrUpdate(member: Member) {
    if (this.created) {
      this.httpMethods.post(this.pathUrlMember, member).subscribe({
        next: () => {
          this.obj = member;
        }
      });
    } else {
      this.httpMethods.patch(`${this.pathUrlMember}`, member).subscribe(() => {
        this.obj = member;
      });
    }
  }
}
