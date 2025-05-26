import { Component } from '@angular/core';
import {ChatComponent} from "../chat/chat.component";

@Component({
  selector: 'app-member-area-main',
  standalone: true,
  imports: [
    ChatComponent
  ],
  templateUrl: './member-area-main.component.html',
  styleUrl: './member-area-main.component.css'
})
export class MemberAreaMainComponent {

}
