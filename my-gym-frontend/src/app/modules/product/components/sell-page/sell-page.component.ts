import {Component} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {CartItem} from "../../../../shared/interfaces/cartItem";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../../auth/services/auth.service";
import {ProductSelectModalComponent} from "../product-select-modal/product-select-modal.component";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {CurrencyPipe} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-sell-page',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatButton,
    CurrencyPipe,
    MatInput,
    MatLabel,
    MatCard
  ],
  templateUrl: './sell-page.component.html',
  styleUrl: './sell-page.component.css'
})
export class SellPageComponent {
  private pathUrl: string = URLS.SALE;
  public cartItems: CartItem[] = [];
  public formGroup: FormGroup;
  public formasPagamento: string[] = ['Dinheiro', 'Cartão', 'Pix'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public authService: AuthService,
    public httpMethods: HttpMethodsService
  ) {
    this.formGroup = this.formBuilder.group({
      client: [""],
      formaPagamento: ["Dinheiro"],
    });
  }

  openProductModal(): void {
    const dialogRef = this.dialog.open(ProductSelectModalComponent, {
      width: '600px',
      data: { academia: this.authService.get_gym(),
              cartItems: this.cartItems },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const existingItem = this.cartItems.find(item => item.produto.id === result.produto.id)

        if (existingItem) {
          existingItem.quantidade += result.quantidade;
        }
        else {
          this.cartItems.push(result);
        }
        this.snackBar.open('Produto adicionado ao carrinho!', 'Fechar', { duration: 3000 });
      }
    });
  }

  ngOnInit(): void {}

  removeItem(item: CartItem): void {
    const index = this.cartItems.findIndex(cartItem => cartItem.produto.id === item.produto.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    } else {
      console.error('Item não encontrado:', item);
      this.snackBar.open('Erro ao remover item.', 'Fechar', { duration: 3000 });
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (Number(item.preco_unitario) * item.quantidade), 0);
  }

  finalizeSale(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Adicione produtos ao carrinho antes de finalizar a venda.', 'Fechar', { duration: 3000 });
      return;
    }

    const saleData = {
      academia: this.authService.get_gym(),
      cliente: this.formGroup.get('client')?.value || null,
      forma_pagamento: this.formGroup.get('formaPagamento')?.value,
      itens: this.cartItems.map(item => ({
        produto: item.produto.id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        valor_total: Number(item.preco_unitario) * item.quantidade
      }))
    };

    this.httpMethods.post(this.pathUrl, saleData).subscribe(
      (response) => {
        this.snackBar.open("Venda finalizada com sucesso", "Fechar", { duration: 3000 });
        this.cartItems = [];
        this.formGroup.reset({ formaPagamento: "Dinheiro" });
        this.router.navigate(["/sales"]).then();
      },
      (error) => {
        console.error('Erro ao finalizar venda:', error);
        this.snackBar.open('Erro ao finalizar venda. Tente novamente.', 'Fechar', { duration: 3000 });
      }
    );
  }

  goBack(): void {
    this.router.navigate(["product/sales"]).then();
  }
}
