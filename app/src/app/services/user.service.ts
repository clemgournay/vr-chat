import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import * as THREE from 'three';

import { WebsocketService } from './websocket.service';
import { environment } from 'src/environments/environment';

import { avatars } from 'src/app/const/avatars';

import { User } from 'src/app/models/user.model';
import { Avatar } from 'src/app/models/avatar.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  baseURL: string = environment.apiURL + '/users';
  self: User;  
  others: any;
  newOther: any;
  othersPosition: any;
  othersRotation: any;
  disconnectingOther: any;
  avatars: Array<Avatar> = avatars;

  constructor(
    private wsService: WebsocketService
  ) {
    this.self = {
      ID: null,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      moving: {left: false, right: false, forward: false, backward: false},
      jump: false
    };
  }

  createUserAndConnect(username: string, avatar: Avatar) {

    this.self.name = username;
    this.self.avatar = avatar;
    const query = `name=${username}&avatarID=${avatar.ID}`;
    this.others = this.wsService.connect(query, (ID: string) => {
      this.self.ID = ID;
    }).pipe(
      map((response: any): any => {
        return response;
      })
    );

    this.newOther = this.wsService.getNewUser().pipe(
      map((response: any): any => {
        return response;
      })
    );
    
    this.othersPosition = this.wsService.getPosition().pipe(
      map((response: any): any => {
        return response;
      })
    );
    this.othersRotation = this.wsService.getRotationY().pipe(
      map((response: any): any => {
        return response;
      })
    );

    this.disconnectingOther = this.wsService.getDisconectingUser().pipe(
      map((response: any): any => {
        return response;
      })
    );
  }
  
  canJump() {
    return this.self.jump;
  }

  move(direction: string, state: boolean) {
    this.self.moving[direction] = state;
  }

  isMoving(direction: string) {
    return this.self.moving[direction];
  }

  changeState(state: string, value: boolean) {
    this[state] = value;
  }

  updatePosition(position: THREE.Vector3) {
    this.self.position.copy(position);
    this.wsService.sendPosition(position);
  }

  updateRotationY(rotationY: number) {
    this.self.rotation.y = rotationY;
    this.wsService.sendRotation(rotationY);
  }

  updateOtherPosition(userID: string, position: {x: number, y: number, z: number}) {
    if (this.others[userID]) {
      this.others[userID].position = new THREE.Vector3(position.x, position.y, position.z);
    }
  }

  updateOtherRotationY(userID: string, rotationY: number) {
    if (this.others[userID]) {
      console.log(this.others[userID]);
      this.others[userID].rotation.y = rotationY;
    }
  }

  addOther(user: any) {
    console.log(this.avatars, user.avatarID)
    const search = this.avatars.filter((avatar: Avatar) => {
      return avatar.ID === user.avatarID
    });
    const avatar = search[0];
    const newUser: User = {
      name: user.name,
      avatar: avatar,
      position: new THREE.Vector3(user.position.x, user.position.y, user.position.z),
      rotation: new THREE.Euler(0, 0, user.rotationY),
      jump: user.jump
    };
    this.others[user.ID] = newUser;
  }

  removeOther(userID: string) {
    delete this.others[userID];
  }

  getID() {
    return this.wsService.getID();
  }

}