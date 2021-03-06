import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import * as THREE from 'three';

import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  messages: any;
  newMessage: any;

  constructor(private wsService: WebsocketService) {

    this.messages = this.wsService.getChatMessages().pipe(
      map((response: any): any => {
        return response;
      })
    );

    this.newMessage = this.wsService.getNewMessages().pipe(
      map((response: any): any => {
        return response;
      })
    );
 
  }

}