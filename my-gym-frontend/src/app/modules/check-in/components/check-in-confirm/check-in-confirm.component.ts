import {Component, Input, OnInit} from '@angular/core';
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-check-in-confirm',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule
  ],
  templateUrl: './check-in-confirm.component.html',
  styleUrl: './check-in-confirm.component.css'
})
export class CheckInConfirmComponent implements OnInit{

  @Input('member') memberPlan?: MemberPlan;
  private gymId: string | null = "";
  protected formGroup: FormGroup;
  private pathUrlFrequncy: string = URLS.FREQUENCY;


  getGym(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({academia: this.gymId});
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private httpMethods: HttpMethodsService,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.formGroup = this.formBuilder.group({
      aluno: [""],
      academia: [this.gymId]
    })
  }

  ngOnInit() {
    this.getGym()
  }


  public confirm() {

    this.formGroup.patchValue({aluno: this.memberPlan?.aluno.id});
    this.httpMethods.post(this.pathUrlFrequncy, this.formGroup.value).subscribe(
      response => {
        console.log(response)
        let  sucessMensage = "check-in realizado com sucesso.";
        this.router.navigate(['check-in/register']);
        this.snackBar.open( sucessMensage,'fechar', {
          duration: 5000,
          verticalPosition: 'top',
        });

      },
      error => {
        console.error('Erro ao fazer check-in', error);
      }
    );
  }




}
