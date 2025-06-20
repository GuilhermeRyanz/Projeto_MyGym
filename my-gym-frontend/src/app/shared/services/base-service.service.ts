import { Injectable } from '@angular/core';
import {HttpMethodsService} from "./httpMethods/http-methods.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})

export abstract class BaseServiceService {

  protected abstract endpoint: string;

  protected constructor (
    private http: HttpMethodsService,
    protected queryParams: Map<String, any>,
    protected model: Object,
  ) {

  }

  addParams (params: Map<String, any>):void {
    this.endpoint = `${this.endpoint}?`;
    params.forEach((param) => {
      if (this.queryParams.has(param.key) && this.queryParams.get(param.key) !== param.key) {
        this.queryParams.delete(param.key);
        this.queryParams.set(param.key, param.value);
      }
      this.queryParams.set(param.key, param.key);
    })

    }

  // getAll(): Observable<T[]>  {
  //   return this.http.getPaginated(this.endpoint, this.queryParams ).pipe(
  //
  // //   )
  //
  // }



}
