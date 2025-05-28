import { Component } from '@angular/core';
import {ChatComponent} from "../../member-area/chat/chat.component";

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [
    ChatComponent
  ],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.css'
})
export class MainChatComponent {

}
