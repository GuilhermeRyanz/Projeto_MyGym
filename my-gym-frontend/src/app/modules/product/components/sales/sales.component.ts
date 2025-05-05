import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Sale } from "../../../../shared/interfaces/sale";
import { URLS } from "../../../../app.urls";
import { Subject } from "rxjs";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { AuthService } from "../../../../auth/services/auth.service";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
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
import {
  MatFormField,
  MatInput,
  MatLabel
} from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    MatPaginator,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    MatIconModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit, AfterViewInit {

  public sales: Sale[] = [];
  public dataSource = new MatTableDataSource<Sale>(this.sales);
  public displayedColumns: string[] = ['cliente', 'vendedor', 'valor_total', 'data_venda'];

  private pathUrlSales: string = URLS.SALE;
  public searchTerm: string = "";
  public currentPage: number = 0;
  public limit: number = 5;
  public totalResults: number = 0;
  public searchChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private httpMethos: HttpMethodsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    console.log('Valor inicial de currentPage:', this.currentPage);
    this.search(); // carrega os dados ao iniciar
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    console.log('Paginator atribuído ao dataSource:', this.dataSource.paginator);

  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.limit);
  }

  public search(): void {
    this.searchRegisters(this.searchTerm, 0);
  }

  public searchRegisters(term: string = '', offset: number = 0, limit: number = this.limit): void {
    console.log('Buscando registros com termo:', term, 'offset:', offset, 'limit:', limit);
    const params: any = {
      expand: ['cliente', 'vendedor', 'itens.produto'],
      active: true,
      academia: this.authService.get_gym,
      limit,
      offset,
    };

    if (term) {
      params.search = term;
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

  public onPaginateChange(event: PageEvent): void {
    const newLimit = event.pageSize;
    const newPageIndex = event.pageIndex;
    const newOffset = newPageIndex * newLimit;

    console.log('Evento de paginação:', event);
    console.log('Novo limite:', newLimit);
    console.log('Novo índice da página:', newPageIndex);
    console.log('Novo offset:', newOffset);
    console.log('Página atual ANTES:', this.currentPage);

    this.limit = newLimit;
    this.currentPage = newPageIndex;
    this.searchRegisters(this.searchTerm, newOffset);
  }

  public nextPage(): void {
    const maxPage = Math.ceil(this.totalResults / this.limit) - 1;
    if (this.currentPage < maxPage) {
      const nextOffset = (this.currentPage + 1) * this.limit;
      this.searchRegisters(this.searchTerm, nextOffset);
    }
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      const prevOffset = (this.currentPage - 1) * this.limit;
      this.searchRegisters(this.searchTerm, prevOffset);
    }
  }

  public onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChanged.next(term);
  }

  public create(): void {
    console.log('Creating new Sales');
  }

}
