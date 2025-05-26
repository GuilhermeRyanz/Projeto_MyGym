import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../../environments/environments";
import {AuthService} from "../../../auth/services/auth.service";
import {DatePipe, NgClass} from "@angular/common";
import {HttpMethodsService} from "../../../shared/services/httpMethods/http-methods.service";

interface ChatMessage {
  id: number;
  text: string;
  time: Date;
  isUser: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    NgClass,
    DatePipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  loading = false;
  @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;

  private messageIdCounter = 0;
  private apiUrl3 = 'api/chat/quest/';
  private apiUrl = 'api/chat/quest/ask_persona/';
  private apiUrl2 = 'api/chat/quest/ask_gestor/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private httpMethods: HttpMethodsService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.chatForm = this.formBuilder.group({
      question: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.httpMethods.get(this.apiUrl3)
      .subscribe((resp)=>{
        this.messages = resp;
      })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.chatForm.invalid || this.loading) return;

    const question = this.chatForm.get('question')?.value;
    const token = this.authService.getToken();

    this.messages.push({
      id: this.messageIdCounter++,
      text: question,
      time: new Date(),
      isUser: true
    });

    this.loading = true;
    this.chatForm.reset();
    this.chatForm.get('question')?.setErrors(null);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const payload = { quest: question };

    this.httpMethods.post(this.apiUrl, payload)


  }

  private scrollToBottom() {
    if (this.chatMessagesContainer) {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }
  }
}
