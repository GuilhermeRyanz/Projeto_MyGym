import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {Employee} from "../../interfaces/employee";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentComponent} from "../confirm-dialog-component/confirm-dialog-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardContent,
    NgForOf,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlEmployee: string = URLS.USERS;
  public employers: Employee[] | undefined;
  public gym_id: string | null = "";
  public typeUser: string | null = "";
  public searchTerm: string = "";


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

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
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

  trackById(index: number, employee: Employee) {
    return employee;
  }

  public searchEmployee(): void {
    let searchParam ="";
    if (this.searchTerm){
      searchParam = `&search=${this.searchTerm}`;
    }
    this.httpMethods.get(`${this.pathUrlEmployee}?academia=${(this.gym_id)}&active=true` + searchParam)
      .subscribe((response: any) => {
        this.employers = response;
        console.log(response);
      })

  }

  getTipoUsuarioClass(tipo: string): string {
    switch (tipo) {
      case 'A': return '#ea62e8';
      case 'G': return '#3787e6';
      case 'D': return '#2dd853';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  getTypeUserClass(type: string): string {
    switch (type) {
      case 'A': return 'Atendente';
      case 'G': return 'Gerente';
      case 'D': return 'Dono';
      default: return '';
    }
  }

  public edit(employee: Employee) {
    this.router.navigate([`/employee/form/${employee.id}`]).then();
  }

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
