import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {URLS} from "../../../../app.urls";
import {Gym} from "../interfaces/gym";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentComponent} from "../confirm-dialog-component/confirm-dialog-component.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-form-gym',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatError
  ],
  templateUrl: './form-gym.component.html',
  styleUrl: './form-gym.component.css'
})
export class FormGymComponent implements OnInit{

  isUnlocked:boolean = false;
  public action: string = '';
  private pathUrlGym: string = URLS.GYM;
  formGroup: FormGroup
  private created: boolean = true
  public title: string = "Cadastro de Academia";

  toggleLock(){
    this.isUnlocked = !this.isUnlocked;
  }

  constructor(
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog

  ) {

    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', [Validators.required, Validators.maxLength(20)]],
      endereco: ['', [Validators.required, Validators.maxLength(60)]],
      telefone: ['', [Validators.required,Validators.pattern('[0-9]{10,11}')]],
      email: ['', [Validators.required, Validators.email]],

    })
  }

  ngOnInit(): void {
    this.retrieveCallBack();
  }

  public retrieveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.title = "Edicao de Academia";
        this.httpMethods.get(this.pathUrlGym + this.action + '/').subscribe((response: any) => {
          this.formGroup.setValue({
            id: response.id,
            nome: response.nome,
            endereco: response.endereco,
            telefone: response.telefone,
            email: response.email,
          });
        });
      }
    });
  }

  public saveOrUpdate(gym: Gym): void {
    if (this.created) {
      this.httpMethods.post(this.pathUrlGym, gym).subscribe(() => {
        this.router.navigate(['/adm/gym/list']);
      })
    } else{
      this.httpMethods.patch(this.pathUrlGym, gym).subscribe(() => {
        this.router.navigate(['/adm/gym/list']);
      });
    }
  }

  public disable(id: number):void{

    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent);
    const path: string = 'desativar_academia'

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpMethods.disable(this.pathUrlGym, id , path).subscribe(() => {
          this.router.navigate(['/adm/gym/list']);
        });
      }
    });

  }


}
