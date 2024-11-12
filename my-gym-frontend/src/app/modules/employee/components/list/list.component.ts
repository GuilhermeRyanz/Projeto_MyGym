import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {Employee} from "../../interfaces/employee";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatLine} from "@angular/material/core";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatLine,
    MatCard,
    MatCardContent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlClient: string = URLS.USERS;
  public employers: Employee[] | undefined;
  public gym_id: string | null = "";
  protected typeUser: string | null = "";

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");

  }

  constructor(private httpMethods: HttpMethodsService, private router: Router) {
  }


  ngOnInit() {
    this.getIdGym()
    this.seach();
    this.getTypeUser()
  }

  getTypeUser(){
    this.typeUser = localStorage.getItem("usuario_tipo");
  }

  public seach(): void {
    this.httpMethods.get(this.pathUrlClient + `?academia=${(this.gym_id)}`).subscribe((response: any) => {
      this.employers = response;
      console.log(response);
    });
  }

  public create(): void {
    this.router.navigate(['/employee/form/create']).then();
  }

  public edit(employee: Employee) {
    this.router.navigate([`/employee/form/${employee.id}`]).then();
  }

  public delete(id: number): void {
    this.httpMethods.delete(this.pathUrlClient, id).subscribe((response: any) => {
      this.seach();
    })

  }


}
