import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';

import { ChatComponent } from './chat.component';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    ChatComponent
  ],
  providers: [
    ChatService,
    WebsocketService
  ],
  bootstrap: [ChatComponent]
})
export class RoomModule { }
