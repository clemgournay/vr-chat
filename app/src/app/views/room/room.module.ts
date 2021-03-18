import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

import { ChatModule } from 'src/app/components/chat/chat.module';

import { RoomComponent } from './room.component';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    BrowserModule,
    ChatModule
  ],
  exports: [
    RoomComponent
  ],
  providers: [
    UserService,
    WebsocketService
  ],
  bootstrap: [RoomComponent]
})
export class RoomModule { }
