import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { URLS } from "../../../../app.urls";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";
import { Product } from "../../../../shared/interfaces/product";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { ProductItemComponent } from "../../../../shared/components/product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { ProductStockModalComponent } from '../product-stock-modal/product-stock-modal.component';
import { Subject, takeUntil } from 'rxjs';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

interface CategoryPagination {
  products: Product[];
  limit: number;
  offset: number;
  totalResults: number;
  loading: boolean;
}

@Component({
  selector: 'app-product-inventory',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatIcon,
    ProductItemComponent,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './products-inventory.component.html',
  styleUrl: './products-inventory.component.css'
})
export class ProductInventoryComponent implements OnInit, OnDestroy {

  private pathUrlProduct: string = URLS.PRODUCT;
  public products: Product[] | undefined;
  public searchterm: string = "";
  public gym_id: string | null = "";
  public searchTerm: string = "";
  public limit: number = 4;
  public loading: boolean = false;
  public totalResults: number = 0;
  public currentPage: number = 0;
  public categories: string[] = [
    'SUPLEMENTO',
    'ACESSORIO',
    'ROUPA',
    'BEBIDA',
    'ALIMENTO',
    'OUTROS'
  ];

  public categoryPanation: {
    [category: string]: CategoryPagination;
  } = {};

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly httpMethods: HttpMethodsService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  private getIdGym(): void {
    this.gym_id = localStorage.getItem("academia");
  }

  public ngOnInit() {
    this.getIdGym();
    for (const category of this.categories) {
      this.categoryPanation[category] = {
        products: [],
        limit: this.limit,
        offset: 0,
        totalResults: 0,
        loading: false
      };
      this.getInventory(category);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public restock(prod: Product) {
    const dialogRef = this.dialog.open(ProductStockModalComponent, {
      width: '400px',
      data: { produtoId: prod.id },
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      if (result) {
        const categoryOfProduct = this.categories.find(cat =>
          this.categoryPanation[cat]?.products.some(p => p.id === prod.id)
        );
        if (categoryOfProduct) {
          this.categoryPanation[categoryOfProduct].products = [];
          this.categoryPanation[categoryOfProduct].offset = 0;
          this.categoryPanation[categoryOfProduct].totalResults = 0;
          this.getInventory(categoryOfProduct);
        }
      }
    });
  }

  public onScroll(category: string) {
    const container = document.getElementById(`category-${category}`) as HTMLElement;

    if (!container) {
      console.log(`Elemento de scroll não encontrado para a categoria: ${category}`);
      return;
    }

    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;

    const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;

    const pagination = this.categoryPanation[category];

    if (!pagination || pagination.loading) {
      return;
    }

    if (atEnd && pagination.products.length < pagination.totalResults) {
      this.loadMoreProducts(category);
    }
  }

  private loadMoreProducts(category: string) {
    const pagination = this.categoryPanation[category];

    if (pagination.offset >= pagination.totalResults) {
      return;
    }

    pagination.loading = true;

    const params = {
      expand: ['lotes'],
      academia: this.gym_id,
      categoria: category,
      limit: pagination.limit,
      offset: pagination.offset,
    };

    this.httpMethods.getPaginated(this.pathUrlProduct, params).pipe(takeUntil(this.unsubscribe$)).subscribe((response: any) => {
      if (response.results && response.results.length > 0) {
        pagination.products.push(...response.results);
        pagination.offset += pagination.limit;
        pagination.totalResults = response.count;
      }
      pagination.loading = false;
    }, (error) => {
      pagination.loading = false;
      console.error('Erro ao carregar mais produtos:', error);
    });
  }

  public getInventory(category: string) {
    const categoryData = this.categoryPanation[category];
    if (categoryData.loading) {
      return;
    }

    categoryData.loading = true;
    const params: any = {
      expand: ['lotes'],
      academia: this.gym_id,
      categoria: category,
      limit: categoryData.limit,
      offset: categoryData.offset,
    };

    this.httpMethods.getPaginated(this.pathUrlProduct, params).pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      const products = response.results;
      const tot = response.count;
      categoryData.products.push(...products);
      categoryData.offset += categoryData.limit;
      categoryData.totalResults = tot;
      categoryData.loading = false;
    }, error => {
      categoryData.loading = false;
    });
  }

  public edit(product: Product) {
    this.router.navigate([`/product/form/${product.id}`]).then();
  }

  public create() {
    this.router.navigate([`/product/form/create/`]);
  }

  public search() {

    const params: any = {
      expand: ['lotes'],
      academia: this.gym_id,
      limit: this.limit,
      offset: this.currentPage,
      search: this.searchterm,
    };

    this.httpMethods.getPaginated(this.pathUrlProduct, params).pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      this.products = response.results;
      this.limit = response.count;
      this.totalResults = response.count;
      this.currentPage = this.limit;

      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }


}
