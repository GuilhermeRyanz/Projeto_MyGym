import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
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
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { URLS } from "../../../app.urls";
import { Expense } from "../../../shared/interfaces/expense";
import { debounceTime, Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { HttpMethodsService } from "../../../shared/services/httpMethods/http-methods.service";
import { AuthService } from "../../../auth/services/auth.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { FormComponent } from "../form/form.component";

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
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  private readonly pathUrl: string = URLS.EXPENSE;
  public Expenses: Expense[] = [];
  protected dataSource: MatTableDataSource<Expense> = new MatTableDataSource<Expense>();
  public searchTerm: string = "";
  public currentPage: number = 0;
  public limit: number = 10;
  public totalResults: number = 0;
  public searchChanged = new Subject<string>();
  protected readonly displayedColumns: string[] = ['id', 'categoria', 'descricao', 'valor', 'data'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private httpMethods: HttpMethodsService,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.search();
    this.searchChanged.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm = term; // Atualiza o searchTerm
      this.searchExpenses(term, 0);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.limit);
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
    this.searchChanged.next(term); // Emite o termo para o Subject
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
