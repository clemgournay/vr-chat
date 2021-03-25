
import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Array<any> = [];
  message: any = {ID: '', text: ''};
  bottom: number = 0;

  @ViewChild('messagesRef') messagesRef: ElementRef;
  @ViewChildren('message') messagesList: QueryList<ElementRef>;

  constructor(
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.messages.subscribe((messages: any) => {
      this.messages = messages;
      console.log(messages);
      this.scrollBottom();
    });

    this.chatService.newMessage.subscribe((message: any) => {
      console.log(message);
      this.messages.push(message);
      console.log(this.messages);
      this.scrollBottom();
    });
  }

  onKeydown(e: KeyboardEvent) {
    if (e.shiftKey && e.code === 'Enter') {
      //this.message.text += '\r\n';
    } else if (e.code === 'Enter') {
      e.preventDefault();
      this.messages.push(JSON.parse(JSON.stringify(this.message)));
      this.chatService.messages.next(this.message);
      this.message.text = '';
      this.scrollBottom();
    }
  }

  scrollBottom() {
    setTimeout(() => {
      this.messagesRef.nativeElement.scrollTop = this.messagesRef.nativeElement.scrollHeight;
    });
  }

  getBottom(i: number) {
    //const el = document.getElementById(`chat-${i}`);

    const el = this.messagesList[i];
    console.log(el);
    if (el) {
      console.log(el.offsetHeight)
      this.bottom += el.offsetHeight + 10;
    }
    return this.bottom;
  }

}
