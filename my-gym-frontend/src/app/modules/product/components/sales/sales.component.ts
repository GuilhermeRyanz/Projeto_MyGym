import { Component } from '@angular/core';
import {Product} from "../../../../shared/interfaces/product";
import {Sale} from "../../../../shared/interfaces/sale";
import {URLS} from "../../../../app.urls";

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {

  public sales: Sale[] | undefined;
  private pathUrlSales: string = URLS.SALE






}
