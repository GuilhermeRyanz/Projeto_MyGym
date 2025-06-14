import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Sale} from "../../../../shared/interfaces/sale";
import {URLS} from "../../../../app.urls";
import {Subject} from "rxjs";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {AuthService} from "../../../../auth/services/auth.service";
import {MatPaginator} from "@angular/material/paginator";
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
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Router} from "@angular/router";
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmComponent} from "../../../../shared/components/dialog-confirm/dialog-confirm.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    CurrencyPipe,
    DatePipe,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatIconModule,
    MatLabel,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatStartDate,
    MatSuffix,
    MatIconButton,
    MatCardModule,
    NgIf
  ],
  standalone: true,
  providers: [provideNativeDateAdapter()],

})
export class SalesComponent implements OnInit, AfterViewInit {

  public sales: Sale[] = [];
  public dataSource = new MatTableDataSource<Sale>(this.sales);
  protected readonly displayedColumns: string[] = ['cliente', 'vendedor', 'valor_total', 'itens', 'data_venda', 'actions'];
  private pathUrlSales: string = URLS.SALE;
  public searchTerm: string = "";
  public currentPage: number = 1;
  public limit: number = 10;
  public totalResults: number = 0;
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public searchChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private httpMethos: HttpMethodsService,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  get endIndex(): number {
    return Math.min(
      (this.currentPage + 1) * this.limit,
      this.totalResults
    );
  }

  get startIndex(): number {
    if (this.totalResults === 0) return 0;
    return this.currentPage * this.limit + 1;
  }

  get total(): number {
    return this.totalResults;
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

  get totalPages(): number {
    return Math.max(Math.ceil(this.totalResults / this.limit), 1);
  }

  public search(): void {
    this.searchRegisters(this.searchTerm, 0);
  }

  public disable(element: number): void{
    const title = 'Excluir Registro'
    const message = 'Deseja realmente excluir este registro?';
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      autoFocus: true,
      data: {
        title,
        message,
        action: 'delete'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let sucessMensage = "Registro apagado"
        this.httpMethos.disable(this.pathUrlSales, element, "cancelar" ).subscribe(() => {
          this.search()
        })
        this.snackBar.open(sucessMensage, "fechar", {
          duration: 5000,
          verticalPosition: 'top',
        })
      }
      else {
        return
      }

    })

  }

  public searchRegisters(term: string = '', offset: number = 0, limit: number = this.limit): void {
    const params: any = {
      expand: ['cliente', 'vendedor', 'itens.produto'],
      active: true,
      academia: this.authService.get_gym(),
      limit,
      offset,
    };

    if (term) {
      params.search = term;
    }

    if (this.startDate){
      params.data_after = this.startDate.toISOString().split('T')[0];
    }
    if (this.endDate){
      params.data_before = this.endDate.toISOString().split('T')[0];
    }

    this.httpMethos.getPaginated(this.pathUrlSales, params).subscribe(
      (response: any) => {
        this.totalResults = response.count;
        this.sales = response.results;
        this.dataSource.data = this.sales;
        this.currentPage = offset / limit;
      }
    );
  }

  public nextPage(): void {
    const maxPage = Math.ceil(this.totalResults / this.limit) - 1;
    if (this.currentPage < maxPage) {
      const nextOffset = (this.currentPage + 1) * this.limit;
      this.searchRegisters(this.searchTerm, nextOffset);
    }
  }

  public clearDateRange(): void {
    this.startDate = null;
    this.endDate = null;
    this.search();
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      const prevOffset = (this.currentPage - 1) * this.limit;
      this.searchRegisters(this.searchTerm, prevOffset);
    }
  }

  public onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchRegisters(this.searchTerm, 0);
  }

  public create(): void {
    this.router.navigate(["/product/sellPage"]).then();
  }
}
