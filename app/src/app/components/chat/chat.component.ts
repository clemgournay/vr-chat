
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, AfterViewChecked } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  messages: Array<any> = [];
  message: any = {ID: '', text: ''};
  bottom: number = 0;

  @ViewChild('messagesRef') messagesRef: ElementRef;
  @ViewChildren('message') messagesList: QueryList<ElementRef>;

  constructor(
    private cdRef: ChangeDetectorRef,
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
 
  ngAfterViewChecked() {
    let bottom = 10;
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const el = this.messagesList.toArray()[i];
      if (el) {
        this.messages[i].bottom = bottom;
        bottom += el.nativeElement.offsetHeight + 10;
      }
    }
    this.cdRef.detectChanges();
  }

  onKeydown(e: KeyboardEvent) {
    if (e.shiftKey && e.code === 'Enter') {
      //this.message.text += '\r\n';
    } else if (e.code === 'Enter') {
      e.preventDefault();
      this.messages.push(JSON.parse(JSON.stringify(this.message)));
      this.chatService.messages.next(this.message.text);
      this.message.text = '';
      this.scrollBottom();
    }
  }

  scrollBottom() {
    setTimeout(() => {
      this.messagesRef.nativeElement.scrollTop = this.messagesRef.nativeElement.scrollHeight;
    });
  }

  showMessages() {
    console.log(this.messagesList.toArray()[0]);
  }

}
