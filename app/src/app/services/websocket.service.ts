import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import * as THREE from 'three';

import { environment } from 'src/environments/environment';

@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket: any;

  constructor() {
    
  }

  connect() {
    this.socket = io(environment.apiURL);

    let observable = new Observable(observer => {
      this.socket.on('users', (users: any) => {
        observer.next(users);
      });
    });

    let observer = {
      next: (data: Object) => {
        //this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable)
  }

  getPosition() {
    let observable = new Observable(observer => {
      this.socket.on('receive position', (resp: any) => {
        observer.next(resp);
      });
    });

    let observer = {
      next: (data: Object) => {
        //this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable)
  }

  getNewUser() {
    let observable = new Observable(observer => {
      this.socket.on('new user', (user: any) => {
        observer.next(user);
      });
    });

    let observer = {
      next: (data: Object) => {
        //this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable)
  }

  getDisconectingUser() {
    let observable = new Observable(observer => {
      this.socket.on('user left', (user: any) => {
        console.log('user left');
        observer.next(user);
      });
    });

    let observer = {
      next: (data: Object) => {
        //this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable)
  }

  sendPosition(position: THREE.Vector3) {
    this.socket.emit('user position', position);
  }

}