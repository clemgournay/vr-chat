
import { Component, OnInit } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Array<any> = [];
  message: any;

  constructor(
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.messages.subscribe((messages: any) => {
      this.messages = messages;
      console.log(messages);
    });
  }

  onKeydown(e: KeyboardEvent) {
    if (e.code === 'EnterKey') {

    }
  }

}
