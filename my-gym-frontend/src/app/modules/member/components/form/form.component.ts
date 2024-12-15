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
import {map, of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";


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
  public action: string = "";
  protected plans: Plan[] = [];
  private pathUrlMember: string = URLS.MEMBER;
  private pathUrlPlan: string = URLS.PLAN;
  formGroup: FormGroup;
  private created: boolean = true;
  private gymId: string | null = "";
  selectedIndex: number = 0;
  public title: string = "Cadastro de aluno";


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
        this.title = "Edição de aluno"
        this.httpMethods.get(this.pathUrlMember + `${this.action}/`).subscribe((response: any) => {
          this.obj = response
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
      this.httpMethods.get(this.pathUrlMember + `?email=${member.email}`).subscribe((response: any) => {
        if (response && response.length > 0) {
          this.router.navigate([`/member/form/${response[0].id}`]);
          const userExistMessage = 'O usuário já existe no sistema. Altere apenas seu plano.';
          this.snackBar.open(userExistMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
          this.selectedIndex = 1;
          return of(null);
        } else {
          return this.httpMethods.post(this.pathUrlMember, member).pipe(
            map((resp: any) => resp as Member)
          ).subscribe((resp: Member) => {
            this.obj = resp
            this.selectedIndex = 1;
          });
        }
      })
    } else {
      this.httpMethods.patch(`${this.pathUrlMember}`, member).subscribe(() => {
        const sucessMenssage = 'Dados do aluno atualizados'
        this.snackBar.open(sucessMenssage, 'O usuário', {
          duration: 5000,
          verticalPosition: 'top',
        })
        this.obj = member;
      });
    }
  }
  public return(){
    this.router.navigate(['/member/list/'])
  }
}
