import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/services/auth.service";
import {MatButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'my-gym-frontend';
  user: string | null = '';
  email: string | null = '';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    if (typeof localStorage !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      this.isLoggedIn = !!accessToken;

      if (this.isLoggedIn) {
        this.user = localStorage.getItem('name');
        this.email = localStorage.getItem('email');
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}
