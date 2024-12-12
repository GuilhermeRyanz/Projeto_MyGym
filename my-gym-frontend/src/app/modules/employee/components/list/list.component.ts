import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {Employee} from "../../interfaces/employee";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatLine} from "@angular/material/core";
import {MatCard, MatCardActions, MatCardContent, MatCardSubtitle} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentComponent} from "../confirm-dialog-component/confirm-dialog-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatLine,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardActions,
    MatToolbar
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlEmployee: string = URLS.USERS;
  public employers: Employee[] | undefined;
  public gym_id: string | null = "";
  public typeUser: string | null = "";


  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");

  }

  constructor(
    private httpMethods: HttpMethodsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
  }


  ngOnInit() {
    this.getIdGym()
    this.seach();
    this.getTypeUser()
  }

  getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }


  public seach(): void {
    this.httpMethods.get(this.pathUrlEmployee + `?academia=${(this.gym_id)}&active=true`).subscribe((response: any) => {
      this.employers = response;
    },
      (error) => {
        console.error("Erro ao carregar os dados do funcionarios:", error);
      });
  }

  public create(): void {
    this.router.navigate(['/employee/form/create']).then();
  }

  public edit(employee: Employee) {
    this.router.navigate([`/employee/form/${employee.id}`]).then();
  }

  // public delete(id: number): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponentComponent);
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       let sucessMensage = "Funcionario apagado"
  //       this.httpMethods.delete(this.pathUrlEmployee, id).subscribe(() => {
  //         this.seach();
  //         this.snackBar.open(sucessMensage, "fechar", {
  //           duration: 5000,
  //           verticalPosition: 'top',
  //         })
  //       })
  //     }
  //   })
  // }

  public disable(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent);
    const path: string = 'desativar_usuario'

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let sucessMensage = "Funcionario apagado"
        this.httpMethods.disable(this.pathUrlEmployee, employee, path).subscribe(() => {
          this.seach()
        })
        this.snackBar.open(sucessMensage, "fechar", {
          duration: 5000,
          verticalPosition: 'top',
        })
      }
    })

  }

}
