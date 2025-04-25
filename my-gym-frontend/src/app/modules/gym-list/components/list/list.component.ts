import {Component, OnInit} from '@angular/core';
import {Gym} from "../../../../shared/interfaces/gym";
import {URLS} from "../../../../app.urls";
import {HttpMethodsService} from "../../../../shared/services/httpMethods/http-methods.service";
import {Router} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
    MatButton,
    DecimalPipe,


  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  private pathUrlClient: string = URLS.GYM;
  public gyms: Gym[] | undefined;
  public limit: number = 12;
  public totalResults: number = 0;
  public currentPage: number = 1;

  constructor(
    private httpMethods: HttpMethodsService,
    private router: Router) {
  }


  ngOnInit() {
    this.search();
  }

  public search(offset: number= 0, limit: number = this.limit): void {
    const params: any = {
      active: true,
      limit,
      offset,
    };

    this.httpMethods.getPaginated(this.pathUrlClient, params).subscribe((response: any) => {
      this.gyms = response.results;
      this.totalResults = response.count;
      this.currentPage = offset / limit;
    });
  }

  public nextPage(): void {
    const maxPage = Math.ceil(this.currentPage / this.limit) - 1;
    if (this.currentPage < maxPage) {
      const nextOffset = (this.currentPage - 1) * this.limit;
      this.search(nextOffset);
    }
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      const prevOffset = (this.currentPage - 1) * this.limit;
      this.search(prevOffset);
    }
  }

  public create(): void {
    this.router.navigate(['adm/form/create']).then();
  }

  public selectGym(gym: Gym): void {
    localStorage.setItem('academia', String(gym.id));
    localStorage.setItem('academia_nome', String(gym.nome));
    this.router.navigate([`my_gym/home/`]).then();


  }

  public edit(gym: Gym) {
    this.router.navigate([`adm/form/${gym.id}`]).then();
  }


}
