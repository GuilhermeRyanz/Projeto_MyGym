import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Member } from "../../../../shared/interfaces/member";
import { URLS } from "../../../../app.urls";
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";

// --- NOVOS IMPORTS ---
// Adicione a importação do novo componente que você criou
import { FacialCaptureComponent } from '../facial-capture/facial-capture.component';
import { MemberPlanComponent } from "../member-plan/member-plan.component";


@Component({
  selector: 'app-form',
  standalone: true,
  // Adicione FacialCaptureComponent aos imports
  imports: [
    FormsModule, MatButton, MatFormField, MatInput, MatLabel, ReactiveFormsModule,
    MatTabGroup, MatTab, MemberPlanComponent, MatError,
    FacialCaptureComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public obj?: Member;
  public action: string = "";
  private pathUrlMember: string = URLS.MEMBER;
  formGroup: FormGroup;
  private created: boolean = true;
  public gymId: string | null = "";
  public title: string = "Cadastro de Aluno";

  // --- PROPRIEDADES DE ESTADO PARA O FLUXO DE 3 ETAPAS ---
  selectedIndex: number = 0; // Controla a aba ativa
  isLoading = false;
  facialCaptureCompleted = false; // Controla a habilitação da última aba

  constructor(
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', [Validators.required, Validators.maxLength(50)]],
      telefone: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      email: ['', [Validators.required, Validators.email]],
      data_nascimento: ['', Validators.required],
      academia: [null],
      matricula: [],
    });
  }

  ngOnInit() {
    this.getGym();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.title = "Edição de Aluno";
        // No modo de edição, busca os dados do aluno
        this.httpMethods.get(`${this.pathUrlMember}${this.action}/`).subscribe((response: Member) => {
          this.obj = response;
          this.formGroup.patchValue(response);
          // Em edição, assumimos que o rosto já foi cadastrado para habilitar a aba de planos.
          // Se precisar re-cadastrar, o usuário pode clicar na aba 2.
          this.facialCaptureCompleted = true;
        });
      }
    });
  }

  getGym(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({academia: this.gymId});
    }
  }

  public saveOrUpdate(member: Member) {
    this.isLoading = true;
    if (this.created) {
      // Sua lógica de POST existente permanece a mesma, mas a ação no sucesso muda.
      this.httpMethods.post(this.pathUrlMember, member).pipe(
        map((resp: any) => resp as Member)
      ).subscribe({
        next: (resp: Member) => {
          this.isLoading = false;
          this.obj = resp; // Armazena os dados do aluno recém-criado (incluindo o ID)
          this.snackBar.open('Dados salvos! Prossiga para o cadastro facial.', 'Ok', { duration: 3000 });
          this.selectedIndex = 1; // <<-- MUDANÇA PRINCIPAL: Avança para a aba 2 (Facial)
          console.log(this.obj)
        },
        error: (err) => {
          this.isLoading = false;
          // Seu handleError no serviço já mostra o snackbar com o erro do backend.
        }
      });
    } else {
      // Sua lógica de PATCH existente.
      // Assumimos que o 'patch' está no seu HttpMethodsService. Se não, adicione-o.
      this.httpMethods.patch(`${this.pathUrlMember}`, member).subscribe({
        next: () => {
          this.isLoading = false;
          const sucessMenssage = 'Dados do aluno atualizados';
          this.snackBar.open(sucessMenssage, 'Fechar', { duration: 5000, verticalPosition: 'top' });
          this.obj = member;
          this.selectedIndex = 2; // Na edição, vai direto para a aba de planos
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    }
  }

  // NOVA FUNÇÃO: É chamada pelo (captureComplete) do componente filho.
  onFacialCaptureComplete() {
    this.snackBar.open('Cadastro facial concluído! Agora, selecione um plano.', 'Ok', { duration: 3000 });
    this.facialCaptureCompleted = true;
    this.selectedIndex = 2; // <<-- MUDANÇA PRINCIPAL: Avança para a aba 3 (Planos)

  }

  public return() {
    this.router.navigate(['/member/list/']);
  }
}
