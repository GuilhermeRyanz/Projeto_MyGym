import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DatePipe, NgClass} from '@angular/common';
import {HttpMethodsService} from '../../../shared/services/httpMethods/http-methods.service';

interface ChatMessage {
  id: number;
  text: string;
  time: Date;
  isUser: boolean;
  question?: string;
  answer?: string;
  active?: boolean;
  created_at?: Date;
  modified_at?: Date;
  usuario?: number;
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
  @Input() IsMember: boolean = false;

  private messageIdCounter = 0;
  private apiUrl3 = 'api/chat/quest/';
  private apiUrl = ""

  constructor(
    private formBuilder: FormBuilder,
    private httpMethods: HttpMethodsService,
  ) {
    this.chatForm = this.formBuilder.group({
      quest: ['', Validators.required]
    });
  }

  ngOnInit() {

    if (this.IsMember) {
      this.apiUrl = 'api/chat/quest/ask_persona/';
    } else {
      this.apiUrl = 'api/chat/quest/ask_gestor/';
    }

    this.httpMethods.get(this.apiUrl3).subscribe((resp: any) => {
      this.messages = resp.results.flatMap((msg: any) => [
        {
          id: this.messageIdCounter++,
          text: msg.question,
          time: new Date(msg.created_at),
          isUser: true,
          active: msg.active,
          answer: msg.answer,
          created_at: new Date(msg.created_at),
          modified_at: new Date(msg.modified_at),
          question: msg.question,
          usuario: msg.usuario
        },
        {
          id: this.messageIdCounter++,
          text: msg.answer,
          time: new Date(msg.created_at),
          isUser: false,
          active: msg.active,
          answer: msg.answer,
          created_at: new Date(msg.created_at),
          modified_at: new Date(msg.modified_at),
          question: msg.question,
          usuario: msg.usuario
        }
      ]);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.chatForm.invalid || this.loading) return;

    const quest = this.chatForm.get('quest')?.value;

    this.messages.push({
      id: this.messageIdCounter++,
      text: quest,
      time: new Date(),
      isUser: true,
      active: true,
      answer: '',
      question: quest,
      created_at: new Date(),
      modified_at: new Date(),
    });

    this.loading = true;

    const payload = {quest: quest};

    this.chatForm.reset();
    this.chatForm.get('quest')?.setErrors(null);

    this.httpMethods.post(this.apiUrl, payload).subscribe(
      response => {
        this.loading = false;
        this.messages.push({
          id: this.messageIdCounter++,
          text: response['result'],
          time: new Date(),
          isUser: false,
          active: true,
          answer: response['result'],
          question: quest,
          created_at: new Date(),
          modified_at: new Date(),
        });
        this.scrollToBottom();
      }
    );
  }

  private scrollToBottom() {
    if (this.chatMessagesContainer) {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }
  }
}
