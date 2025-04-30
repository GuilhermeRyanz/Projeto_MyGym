import {Component, DoCheck, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from "./auth/services/auth.service";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {DataRowOutlet} from "@angular/cdk/table";
import {MainComponent} from "./main/main.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatToolbar, MatSidenavContainer, MatSidenavModule, MatIcon, RouterLink, MatAnchor, MatIconButton, MatNavList, MatListItem, DataRowOutlet, MainComponent,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {}
