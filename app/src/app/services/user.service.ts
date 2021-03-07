import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import * as THREE from 'three';

import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  properties = {
    mass: 100
  };
  jump: boolean = false;
  moving = {forward: false, backward: false, left: false, right: false};
  position: THREE.Vector3;
  users: any;
  usersPosition: any;
  disconnectingUser: any;

  constructor(private wsService: WebsocketService) {

    this.position = new THREE.Vector3(0, 10, 0);

    this.users = this.wsService.connect().pipe(
      map((response: any): any => {
        return response;
      })
    );
    
    this.usersPosition = this.wsService.getPosition().pipe(
      map((response: any): any => {
        return response;
      })
    );
    this.disconnectingUser = this.wsService.getDisconectingUser().pipe(
      map((response: any): any => {
        return response;
      })
    );
    
  }

  getProperties() {
    return this.properties;
  }
  
  canJump() {
    return this.jump;
  }

  move(direction: string, state: boolean) {
    this.moving[direction] = state;
  }

  isMoving(direction: string) {
    return this.moving[direction];
  }

  changeState(state: string, value: boolean) {
    this[state] = value;
  }

  updatePosition(position: THREE.Vector3) {
    this.position.copy(position);
    this.wsService.sendPosition(position);
  }

  updateUserPosition(userID: string, position: {x: number, y: number, z: number}) {
    if (this.users[userID]) {
      this.users[userID].position = new THREE.Vector3(position.x, position.y, position.z);
    }
  }

  addUser(user: any) {
    this.users[user.ID] = user;
  }

  removeUser(userID: string) {
    delete this.users[userID];
  }

  getPosition() {
    return this.position;
  }

  getID() {
    return this.wsService.getID();
  }

}