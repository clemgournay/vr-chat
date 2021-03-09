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
  rotation: THREE.Euler;
  users: any;
  usersPosition: any;
  usersRotation: any;
  disconnectingUser: any;

  constructor(private wsService: WebsocketService) {

    this.position = new THREE.Vector3(0, 10, 0);
    this.rotation = new THREE.Euler(0, 0, 0);

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
    this.usersRotation = this.wsService.getRotation().pipe(
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

  updateRotation(rotation: THREE.Euler) {
    this.rotation.copy(rotation);
    this.wsService.sendRotation(rotation);
  }

  updateUserPosition(userID: string, position: {x: number, y: number, z: number}) {
    if (this.users[userID]) {
      this.users[userID].position = new THREE.Vector3(position.x, position.y, position.z);
    }
  }

  updateUserRotation(userID: string, rotation: number) {
    if (this.users[userID]) {
      this.users[userID].rotation = rotation;
    }
  }

  addUser(user: any) {
    this.users[user.ID] = user;
  }

  removeUser(userID: string) {
    delete this.users[userID];
  }

  getID() {
    return this.wsService.getID();
  }

}