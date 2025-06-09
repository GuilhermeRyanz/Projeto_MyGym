import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {URLS} from "../../../app.urls";
import {Expense} from "../../../shared/interfaces/expense";
import {debounceTime, elementAt, Subject} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {HttpMethodsService} from "../../../shared/services/httpMethods/http-methods.service";
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FormComponent} from "../form/form.component";
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {DialogConfirmComponent} from "../../../shared/components/dialog-confirm/dialog-confirm.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatLabel,
    MatRow,
    MatRowDef,
    MatTable,
    ReactiveFormsModule,
    MatHeaderCellDef,
    FormsModule,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatStartDate,
    MatSuffix,
    MatIconButton,
    NgIf
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [provideNativeDateAdapter()],
})
export class ListComponent implements OnInit {
  public Expenses: Expense[] = [];
  public searchTerm: string = "";
  public currentPage: number = 0;
  public limit: number = 10;
  public totalResults: number = 0;
  public searchChanged = new Subject<string>();
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected dataSource: MatTableDataSource<Expense> = new MatTableDataSource<Expense>();
  protected readonly displayedColumns: string[] = ['categoria', 'descricao', 'valor', 'data', 'actions'];
  protected readonly elementAt = elementAt;
  private readonly pathUrl: string = URLS.EXPENSE;

  constructor(
    private httpMethods: HttpMethodsService,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.limit);
  }

  ngOnInit() {
    this.search();
    this.searchChanged.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm = term;
      this.searchExpenses(term, 0);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public search(): void {
    this.searchExpenses(this.searchTerm, 0);
  }

  public searchExpenses(term: string = '', offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      limit,
      offset,
      active: true,
      academia: this.authService.get_gym(),
    };

    if (term) {
      params.search = term;
    }

    if (this.startDate) {
      params.data_after = this.startDate.toISOString().split('T')[0];
    }
    if (this.endDate) {
      params.data_before = this.endDate.toISOString().split('T')[0];
    }

    this.httpMethods.getPaginated(this.pathUrl, params)
      .subscribe((response: any) => {
        this.Expenses = response.results;
        this.totalResults = response.count;
        this.dataSource.data = this.Expenses;
        this.currentPage = offset / limit;
      });
  }

  public nextPage(): void {
    const maxPage = Math.ceil(this.totalResults / this.limit) - 1;
    if (this.currentPage < maxPage) {
      const nextOffset = (this.currentPage + 1) * this.limit;
      this.searchExpenses(this.searchTerm, nextOffset);
    }
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      const previousOffset = (this.currentPage - 1) * this.limit;
      this.searchExpenses(this.searchTerm, previousOffset);
    }
  }

  public onSearchChange(term: string): void {
    this.searchChanged.next(term);
  }

  public onDateRangeChange(dateRange: any): void {
    if (dateRange.start) {
      this.startDate = dateRange.start;
    }
    if (dateRange.end) {
      this.endDate = dateRange.end;
    }
    this.search();
  }

  public clearDateRange(): void {
    this.startDate = null;
    this.endDate = null;
    this.search();
  }

  public delete(element: any): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      panelClass: 'custom-modal',
      autoFocus: true,
      data: {
        title: 'Excluir registro de gasto',
        message: "Deseja realmente excluir este registro?",
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === true) {
          const body = {
            id: element.id,
          };

          this.httpMethods.disable(this.pathUrl, body, "disable").subscribe({
            next: () => {
              this.snackBar.open('Registro excluído com sucesso!', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
              this.searchExpenses(this.searchTerm, 0);
            },
            error: (error) => {
              this.snackBar.open('Erro ao excluir registro!', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              });
            }
          });
        }
      }
    });
  }


  public edit(element: any): void {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '600px',
      maxWidth: '90vw',
      minHeight: '400px',
      panelClass: 'custom-modal',
      autoFocus: true,
      data: {
        title: 'atualizar registro',
        action: 'update',
        expense: {
          id: element.id,
          academia: this.authService.get_gym(),
          categoria: '',
          descricao: '',
          valor: 0,
          data: null
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchExpenses(this.searchTerm, 0);
      }
    });
  }

  public create(): void {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '600px',
      maxWidth: '90vw',
      minHeight: '400px',
      panelClass: 'custom-modal',
      autoFocus: true,
      data: {
        title: 'Novo Gasto',
        action: 'create',
        expense: {
          academia: this.authService.get_gym(),
          categoria: '',
          descricao: '',
          valor: 0,
          data: null
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchExpenses(this.searchTerm, 0);
      }
    });
  }
}
