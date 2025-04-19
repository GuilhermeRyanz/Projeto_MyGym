import {Component, Input, OnInit} from '@angular/core';
import {MemberPlan} from "../../../../shared/interfaces/member-plan";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-check-in-confirm',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    ReactiveFormsModule,
    MatIcon,
    MatCardHeader
  ],
  templateUrl: './check-in-confirm.component.html',
  styleUrl: './check-in-confirm.component.css'
})
export class CheckInConfirmComponent implements OnInit{

  @Input('member') memberPlan?: MemberPlan;
  private gymId: string | null = "";
  protected formGroup: FormGroup;
  private pathUrlFrequncy: string = URLS.FREQUENCY;
  currentTime: string = '';



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
    this.updateTime();
    this.formGroup = this.formBuilder.group({
      aluno: [""],
      academia: [this.gymId]
    })
  }

  ngOnInit() {
    this.getGym()
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  updateTime() {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleString();
    }, 1000);
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
