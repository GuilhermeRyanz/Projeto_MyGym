import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Member} from "../../interfaces/member";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemLine, MatListSubheaderCssMatStyler} from "@angular/material/list";

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
    MatListSubheaderCssMatStyler
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlMember: string = URLS.MEMBER;
  private pathUrlMemberPlan: string = URLS.MEMBERPLAN
  public members: Member[] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("usuario_tipo");
  }

  constructor(private httpMethods: HttpMethodsService, private router: Router) {
  }

  ngOnInit() {
    this.getIdGym();
    this.seach();
    this.getTypeUser()
  }

  public seach():void{
    this.httpMethods.get(this.pathUrlMember + `?active=True&academia=${this.gym_id}`).subscribe((response: any) => {
      this.members = response;
      console.log(response)
    });
  }

  public create(): void {
    this.router.navigate(['/member/form/create']).then();
  }

  public edit(member: Member) {
    this.router.navigate([`/member/form/${member.id}`]).then();
  }

  public disable(member: Member): void {
    this.httpMethods.disable(this.pathUrlMemberPlan ,member, 'desativar_aluno').subscribe(() => {
      this.seach();
    })
  }

}
