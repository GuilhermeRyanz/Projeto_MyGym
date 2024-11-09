import {Component, OnInit} from '@angular/core';
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

export class AppComponent implements OnInit{


  title = 'my-gym-frontend';
  user: string | null = '';
  email: string | null = '';
  isLoggedIn: boolean = false;

  showBanner: boolean = false;

  userInfor(){
    this.user = localStorage.getItem('nome_usuario');
    this.email = localStorage.getItem('email');
  }



  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(){
    this.authService.showBannerEmmiter.subscribe(
      show => this.showBanner = show
    );
    this.userInfor()
  }


  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}
