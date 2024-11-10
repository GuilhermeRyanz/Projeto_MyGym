import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from "./auth/services/auth.service";
import { MatButton } from "@angular/material/button";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatToolbar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'my-gym-frontend';
  user: string | null = '';
  email: string | null = '';
  isLoggedIn: boolean = false;
  showBanner: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.userIsAuth()) {
      this.isLoggedIn = true;
      this.showBanner = true;
      this.userInfor();
    }

    this.authService.showBannerEmmiter.subscribe(
      show => this.showBanner = show
    );

    this.authService.userUpdateEmitter.subscribe(() => {
      this.userInfor();
      this.isLoggedIn = true;
    });
  }

  userInfor() {
    this.user = localStorage.getItem('nome_usuario');
    this.email = localStorage.getItem('email');
  }

  logout() {
    this.authService.showBannerEmmiter.emit(false);
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}
