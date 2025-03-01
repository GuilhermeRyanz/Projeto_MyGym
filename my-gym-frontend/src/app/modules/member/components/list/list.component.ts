import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Member} from "../../interfaces/member";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemLine, MatListSubheaderCssMatStyler} from "@angular/material/list";
import {MemberPlan} from "../../interfaces/member-plan";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentComponent} from "../confirm-dialog-component/confirm-dialog-component.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatIcon,
    MatIconButton,
    MatList,
    MatListItem,
    MatListItemLine,
    MatListSubheaderCssMatStyler,
    MatCardContent,
    MatCardActions,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    NgForOf
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

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

  public create(): void {
    this.router.navigate(['/member/form/create']).then();
  };

  public edit(member: Member) {
    this.router.navigate([`/member/form/${member.id}`]).then();
  };

  trackById(index: number, member: MemberPlan) {
    return member.aluno.id;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }

  public disable(member: Member): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.gym_id) {
          member.academia = this.gym_id;
        } else {
          console.error('Gym ID is missing');
          return;
        }
        this.httpMethods.disable(this.pathUrlMemberPlan, member, 'desativar_aluno').subscribe(() => {
          this.seach();
          let sucessMensage =  "Aluno desativado"
          this.snackBar.open(  sucessMensage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        })
      }
    })
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


}
