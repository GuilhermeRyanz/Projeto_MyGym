import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Product} from "../../../../shared/interfaces/product";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {ProductItemComponent} from "../../../../shared/components/product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { ProductStockModalComponent } from '../product-stock-modal/product-stock-modal.component';


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
    MatLabel
  ],
  templateUrl: './products-inventory.component.html',
  styleUrl: './products-inventory.component.css'
})
export class ProductInventoryComponent implements OnInit {

  private pathUrlProduct: string = URLS.PRODUCT;
  public products: Product[] | undefined;

  constructor(
    private readonly httpMethods: HttpMethodsService,
    private router: Router,
    private dialog: MatDialog


  ) {
  }

  public ngOnInit() {
    this.getInventory();
  }

  public abastecer(prod: Product) {
    const dialogRef = this.dialog.open(ProductStockModalComponent, {
      width: '400px',
      data: { produtoId: prod.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getInventory();
      }
    });
  }

  public getInventory() {
    this.httpMethods.get(`${this.pathUrlProduct}?expand=lotes`).subscribe(response => {
      this.products = response;
      console.log(this.products);
    })

  }

  public edit(product: Product) {
    this.router.navigate([`/product/form/${product.id}`]).then();
  }

  public create() {
    this.router.navigate([`/product/form/create/`]);
  }

}
