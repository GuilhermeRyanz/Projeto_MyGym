import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {routes} from "./gym-list.routes";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule

  ]
})
export class GymListModule { }
