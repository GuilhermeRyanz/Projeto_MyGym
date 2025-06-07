import {Component, Inject, OnInit} from '@angular/core';
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {AuthService} from "../../../../auth/services/auth.service";
import {URLS} from "../../../../app.urls";
import {Batch} from "../../../../shared/interfaces/batch";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {response} from "express";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-product-stock-list',
  standalone: true,
  imports: [],
  templateUrl: './product-stock-list.component.html',
  styleUrl: './product-stock-list.component.css'
})
export class ProductStockListComponent implements OnInit{

  public pathUrl = URLS.BATCH
  public batches: Batch[] = []

  constructor(
    private httpMethods: HttpMethodsService,
    private authMethods: AuthService,
    private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any
){}

  ngOnInit() {
    this.search()
  }

  public search(){
    const queryParams = {
      active: true,
    }

    this.httpMethods.getPaginated(this.pathUrl + '/' + this.data.id + '/', queryParams).subscribe(
      (response: any) => {
        this.batches = response.results
      }
    )
  }

  public delete(element: any){

    this.httpMethods.delete(this.pathUrl, element.id).subscribe(
      (response: any) => {
        const msg = 'Lote apagado'
        this.snackBar.open(msg, 'fechar', {
          duration: 5000,
          verticalPosition: 'top',
        })
      }
    )
  }

}
