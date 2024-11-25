import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/services/auth.service";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {Gym} from "./modules/gym-list/interfaces/gym";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatToolbar, MatSidenavContainer, MatSidenavModule, MatIcon, RouterLink, MatAnchor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title = 'my-gym-frontend';
  public user: string | null = '';
  public email: string | null = '';
  public tipo_usuario: string | null = '';
  public showBanner: boolean = false;
  public showNav: boolean = false;
  public opened = false;
  public gym : Gym | undefined;


  constructor(private authService: AuthService, private router: Router,) {}

  ngOnInit() {
    if (this.authService.userIsAuth()) {
      this.showBanner = true;
      this.userInfor();
    }

    if (this.authService.userIsAuthGy()) {
      this.showNav = true;

    }

    this.authService.showBannerEmmiter.subscribe(
      show => this.showBanner = show
    );

    this.authService.userUpdateEmitter.subscribe(() => {
      this.userInfor();
      if (this.authService.userIsAuthGy()) {
        this.showBanner = true;
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNav = !event.url.includes('adm/gym/list');
      }
      if (event instanceof NavigationEnd){
        this.showBanner = !event.url.includes('auth/login')
      }


    });
  }

  userInfor() {
    this.user = localStorage.getItem('nome_usuario');
    this.email = localStorage.getItem('email');
    this.tipo_usuario = localStorage.getItem('tipo_usuario');

  }

  logout() {
    this.authService.showBannerEmmiter.emit(false);
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
