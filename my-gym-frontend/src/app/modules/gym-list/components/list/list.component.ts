import {Component, OnInit} from '@angular/core';
import {Gym} from "../../interfaces/gym";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {loadavg} from "node:os";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
    MatButton,


  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlClient: string = URLS.GYM;
  public gyms: Gym[] | undefined;

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
    this.router.navigate(['adm/form/create']).then();
  }

  public selectGym(gym: Gym): void {
    localStorage.setItem('academia', String(gym.id));
    localStorage.setItem('academia_nome', String(gym.nome));
    this.router.navigate([`my_gym/home/`]).then();


  }

  public edit(gym: Gym){
    this.router.navigate([`adm/form/${gym.id}`]).then();
  }






}
