import {Component, DoCheck, ViewChild} from '@angular/core';
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "../auth/services/auth.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatAnchor,
    MatIcon,
    MatIconButton,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    RouterLink,
    RouterOutlet,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    RouterLinkActive
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements DoCheck {

  public title = 'my-gym-frontend';
  public user: string | null = '';
  public email: string | null = '';
  public tipo_usuario: string | null = '';
  public showBanner: boolean = false;
  public showNav: boolean = false;
  public opened = false;
  public gym_name: string | null = '';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private authService: AuthService, private router: Router) {
  }

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
        this.showNav = !event.url.includes('adm/');
        this.opened = !event.url.includes('adm/');
      }
      if (event instanceof NavigationEnd) {
        this.showBanner = !event.url.includes('auth/')
        this.opened = !event.url.includes('auth/');
      }

      if (event instanceof NavigationEnd) {
        this.showBanner = !event.url.includes('MemberArea/')
        this.opened = !event.url.includes('MemberArea/');
      }
    });
  }

  ngDoCheck() {
    const currentGymName = localStorage.getItem('academia_nome');
    if (this.gym_name !== currentGymName) {
      this.gym_name = currentGymName;
    }
  }

  userInfor() {
    this.user = localStorage.getItem('nome_usuario');
    this.email = localStorage.getItem('email');
    this.tipo_usuario = localStorage.getItem('tipo_usuario');
    this.gym_name = localStorage.getItem('academia_nome');
  }

  logout() {
    this.authService.showBannerEmmiter.emit(false);
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
