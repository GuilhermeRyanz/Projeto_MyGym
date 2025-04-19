import { Component } from '@angular/core';
import {HttpMethodsService} from "../../../../auth/services/http-methods.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products-inventory',
  standalone: true,
  imports: [],
  templateUrl: './products-inventory.component.html',
  styleUrl: './products-inventory.component.css'
})
export class ProductsInventoryComponent {

  constructor(
    private readonly httpService: HttpMethodsService,
    private router: Router,
  ) {



  }

}
