import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet, RouterLink} from '@angular/router';
import { AuthService } from "./auth/services/auth.service";
import { MatAnchor, MatButton } from "@angular/material/button";
import { MatToolbar } from "@angular/material/toolbar";
import { MatSidenavContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";
=======


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatToolbar, MatSidenavContainer, MatSidenavModule, MatIcon, RouterLink, MatAnchor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'my-gym-frontend';
  user: string | null = '';
  email: string | null = '';
  tipo_usuario: string | null = '';
  isLoggedIn: boolean = false;
  showBanner: boolean = false;
  showNav: boolean = false;
  opened = false;



  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.userIsAuth()) {
      this.isLoggedIn = true;
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
      this.isLoggedIn = true;
      if (this.authService.userIsAuthGy()) {
        this.showBanner = true;
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNav = !event.url.includes('adm/gym/list');
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
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}
