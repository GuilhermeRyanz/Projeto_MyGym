import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CurrencyPipe, NgClass} from "@angular/common";
import {Product} from "../../../../shared/interfaces/product";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {URLS} from "../../../../app.urls";
import {Subject, takeUntil} from "rxjs";
import {CartItem} from "../../../../shared/interfaces/cartItem";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-product-select-modal',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    MatLabel,
    MatFormField,
    MatInput,
    MatCard,
    MatButton,
    NgClass
  ],
  templateUrl: './product-select-modal.component.html',
  styleUrl: './product-select-modal.component.css'
})

export class ProductSelectModalComponent implements OnInit {
  public products: Product[] = [];
  public pathUrl: string = URLS.PRODUCT;
  public searchTerm: string = '';
  public totalResults: number = 0;
  public currentPage: number = 0;
  public limit: number = 6;
  public offset: number = 0;
  public loading: boolean = false;
  public quantities: { [key: number]: number } = {};

  constructor(
    public dialogRef: MatDialogRef<ProductSelectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { academia: number, cartItems: CartItem[] },
    private httpMethods: HttpMethodsService,
    private snackBar: MatSnackBar
  ) {}

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public onScroll(): void {
    const container = document.getElementById("container-prod") as HTMLDivElement;

    if(!container){
      return;
    }

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const atEnd = scrollTop + container.clientHeight >= scrollHeight - 10;

    if (this.loading) {
      return;
    }

    if (atEnd && this.products.length < this.totalResults) {
      this.loadProducts()
    }
  }

  public onSearch(): void {
    this.products = [];
    this.offset = 0;
    this.totalResults = 0;
    this.quantities = {};
    this.loadProducts();
  }

  private loadProducts(): void {
    if (this.offset >= this.totalResults && this.offset !== 0) {
      return;
    }

    this.loading = true;

    const params ={
      expand: ['lotes'],
      academia: this.data.academia,
      search: this.searchTerm,
      limit: this.limit,
      offset: this.offset
    };

    this.httpMethods.getPaginated(this.pathUrl, params).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (response: any) => {
      this.products.push(...response.results);
      this.totalResults = response.totalResults;
      this.products.forEach((product: Product) => {
        if (product.id && !this.quantities[product.id]) {
          this.quantities[product.id] = 1;
          }
      });
      this.loading = false;
      this.offset += this.limit;
    });
  }

  getQuantity(productId: number): number {
    return this.quantities[productId] || 1;
  }

  decreaseQuantity(product: Product): void {
    if (product.id && this.quantities[product.id] > 1) {
      this.quantities[product.id]--;
    }
  }

  public verification_total(product: Product): number {
    const cartItem = this.data.cartItems.find((item: CartItem) => item.produto.id === product.id);
    if (cartItem) {
      return (product.quantidade_estoque || 0) - cartItem.quantidade;
    }
    return product.quantidade_estoque || 0;
  }

  increaseQuantity(product: Product): void {
    if (product.id && (product.quantidade_estoque === undefined || this.quantities[product.id] < product.quantidade_estoque)) {
      this.quantities[product.id]++;
    }
  }

  addToCart(product: Product): void {
    if (!product || !product.id || !product.preco) {
      this.snackBar.open('Selecione um produto válido.', 'Fechar', { duration: 3000 });
      return;
    }
    const quantity = this.getQuantity(product.id);
    if (quantity <= 0) {
      this.snackBar.open('Quantidade deve ser maior que zero.', 'Fechar', { duration: 3000 });
      return;
    }

    if (product.quantidade_estoque !== undefined && quantity > product.quantidade_estoque) {
      this.snackBar.open('Quantidade maior que o estoque disponível.', 'Fechar', { duration: 3000 });
      return;
    }


    const cartItem: CartItem = {
      produto: product,
      quantidade: quantity,
      preco_unitario: product.preco,

    };
    this.dialogRef.close(cartItem);
  }

  protected readonly console = console;
}
