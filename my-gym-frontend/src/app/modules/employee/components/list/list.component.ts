import {Component, OnInit} from '@angular/core';
import {URLS} from "../../../../app.urls";
import {Gym} from "../../../gym-list/interfaces/gym";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {Employee} from "../../interfaces/employee";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{

  private pathUrlClient: string = URLS.USERS;
  public gyms: Employee[] | undefined;

  constructor(private httpMethods: HttpMethodsService, private router: Router) {
  }


  ngOnInit() {
    this.seach();
  }

  public seach(): void {
    this.httpMethods.get(this.pathUrlClient).subscribe((response: any) => {
      this.gyms = response;
      console.log(response);
    });
  }

  public create(): void {
    this.router.navigate(['/form/create']).then();
  }

  public selectGym(gymId: number){
    localStorage.setItem('academia', String(gymId));
    this.router.navigate([`my_gym/home/`]).then();
  }

  public edit(gym: Gym){
    this.router.navigate([`adm/form/${gym.id}`]).then();
  }



}
