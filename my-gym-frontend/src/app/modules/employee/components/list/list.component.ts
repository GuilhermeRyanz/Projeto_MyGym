import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {Employee} from "../../../../shared/interfaces/employee";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponentComponent} from "../confirm-dialog-component/confirm-dialog-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgForOf} from "@angular/common";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {debounceTime, Subject} from "rxjs";
import {PaginatorComponent} from "../../../../shared/components/paginator/paginator.component";
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";

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
    PaginatorComponent,
    MatSuffix,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatHint,
    MatStartDate,
    MatEndDate
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [provideNativeDateAdapter()],

})
export class ListComponent implements OnInit {

  private pathUrlEmployee: string = URLS.USERS;
  public employers: Employee[] | undefined;
  public gym_id: string | null = "";
  public typeUser: string | null = "";
  public searchTerm: string = "";
  public limit: number = 30;
  public totalResults: number = 0;
  public currentPage: number = 0;
  public startDate: Date | null = null;
  public endDate: Date | null = null;

  searchChange = new Subject<string>();


  constructor(
    private httpMethods: HttpMethodsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
  }


  ngOnInit() {
    this.getIdGym()
    this.search();
    this.getTypeUser()

    this.searchChange.pipe(debounceTime(150)).subscribe((term )=> {
      this.searchEmployee(term,0)
    });

  }

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");

  }

  private getTypeUser() {
    this.typeUser = localStorage.getItem("tipo_usuario");
  }

  public search(): void {
    this.searchEmployee(this.searchTerm, 0);
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  }


  public create(): void {
    this.router.navigate(['/employee/form/create']).then();
  }

  trackById(index: number, employee: Employee) {
    return employee;
  }

  public searchEmployee(term: string = ``, offset: number = 0, limit: number = this.limit): void {

    const params: any = {
      active: true,
      academia: this.gym_id,
      limit,
      offset,
    };

    if (term) {
      params.search = term;
    }

    if (this.startDate) {
      params.data_contratacao_after = this.startDate.toISOString().split('T')[0];
    }
    if (this.endDate) {
      params.data_contratacao_before = this.endDate.toISOString().split('T')[0];
    }

    this.httpMethods.getPaginated(this.pathUrlEmployee, params)
      .subscribe((response: any) => {
        this.employers = response.results;
        this.totalResults = response.count;
        this.currentPage = offset / limit;
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChange.next(term);
  }

  onDateRangeChange(dateRange: any): void {
    if (dateRange.start) {
      this.startDate = dateRange.start;
    }
    if (dateRange.end) {
      this.endDate = dateRange.end;
    }
    this.search();
  }


  getTipoUsuarioClass(type: string): string {
    switch (type) {
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
    if (employee.tipo_usuario === 'D') {
      this.snackBar.open(
        "Não é possivel alterar dados do dono da cademia", "Fechar",
        {
          duration: 5000,
          verticalPosition: 'top',
        }
      )
      return
    }

    this.router.navigate([`/employee/form/${employee.id}`]).then();
  }

  public disable(employee: Employee): void {

    if (employee.tipo_usuario === 'D') {
      this.snackBar.open(
        "Não é ppssivel excluir o dono do estabelecimento", "Fechar",
        {
          duration: 5000,
          verticalPosition: 'top',
        }
      )
      return
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent);
    const path: string = 'desativar_usuario'

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let sucessMensage = "Funcionario apagado"
        this.httpMethods.disable(this.pathUrlEmployee, employee, path).subscribe(() => {
          this.search()
        })
        this.snackBar.open(sucessMensage, "fechar", {
          duration: 5000,
          verticalPosition: 'top',
        })
      }
    })

  }

  onPageChange(page: number): void {
    const offset = page * this.limit;
    this.searchEmployee(this.searchTerm, offset);
  }


}
