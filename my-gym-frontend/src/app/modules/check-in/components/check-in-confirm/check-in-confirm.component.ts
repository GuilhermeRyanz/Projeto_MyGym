import {Component, Input, OnInit} from '@angular/core';
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";

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

  ) {
    this.formGroup = this.formBuilder.group({
      aluno: [this.memberPlan?.aluno.id],
      academia: [this.gymId]
    })
  }

  ngOnInit() {
    this.getGym()
    console.log(this.memberPlan);
  }


  public confirm() {

    this.formGroup.patchValue({aluno: this.memberPlan?.aluno.id});
    this.httpMethods.post(this.pathUrlFrequncy, this.formGroup.value).subscribe(
      response => {
        console.log('Check-in efetuado com sucesso', response);
        this.router.navigate(['check-in/register']);

      },
      error => {
        console.error('Erro ao fazer check-in', error);
      }
    );
  }




}
