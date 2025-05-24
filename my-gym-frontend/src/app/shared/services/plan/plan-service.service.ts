import { Injectable } from '@angular/core';
import {HttpMethodsService} from "../httpMethods/http-methods.service";
import {URLS} from "../../../app.urls";

@Injectable({
  providedIn: 'root'
})
export class PlanServiceService {

  private pathUrlPlan: string = URLS.PLAN;

  constructor(
    private httpMethods: HttpMethodsService,
  ) { }

  public getAllPlans(gym_id: string | null, searchTerm: string, limit: number = 5, offset: number = 5) {
    return this.httpMethods.get(this.pathUrlPlan + `?gym_id=${gym_id}&search=${searchTerm}&limit=${limit}&offset=${offset}`);
  }

  public getPlanById(id: string) {
    return this.httpMethods.get(this.pathUrlPlan + `/${id}/`);
  }

}
