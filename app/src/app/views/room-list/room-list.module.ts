import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { UserService } from 'src/app/services/user.service';

import { RoomListComponent } from './room-list.component';

@NgModule({
  declarations: [
    RoomListComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    RoomListComponent
  ],
  providers: [
    UserService
  ],
  bootstrap: [RoomListComponent]
})
export class RoomListModule { }
