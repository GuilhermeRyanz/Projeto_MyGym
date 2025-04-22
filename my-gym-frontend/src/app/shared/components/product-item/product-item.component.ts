import {Component, Input} from '@angular/core';
import {MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatCardContent,
    MatIcon,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() prod: any;

}
