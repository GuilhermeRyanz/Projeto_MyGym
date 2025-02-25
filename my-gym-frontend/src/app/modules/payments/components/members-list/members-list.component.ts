import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatListSubheaderCssMatStyler} from "@angular/material/list";
import {URLS} from "../../../../app.urls";
import {MemberPlan} from "../../../member/interfaces/member-plan";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatListSubheaderCssMatStyler,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MembersListComponent implements OnInit {
  private pathUrlMemberPlan: string = URLS.MEMBERPLAN
  public members: MemberPlan [] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";
  public searchTerm: string = "";

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  constructor(private httpMethods: HttpMethodsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getIdGym();
    this.seach();
    this.getTypeUser()
  }

  public seach(): void {
    this.httpMethods.get(this.pathUrlMemberPlan + `?expand=aluno&expand=plano&active=true&academia=${this.gym_id}`).subscribe((response: any) => {
      this.members = response;
    });
  };

  public searchMember(): void {
    let searchParam = '';
    if (this.searchTerm) {
      searchParam = `&search=${this.searchTerm}`;
    }
    this.httpMethods.get(`${this.pathUrlMemberPlan}?expand=aluno&expand=plano&active=true${searchParam}&academia=${this.gym_id}`)
      .subscribe((response: any) => {
        this.members = response;
        console.log(response);
      });
  }

  public selectMember(): void {

  }

}
