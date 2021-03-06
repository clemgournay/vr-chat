import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RoomComponent } from './room.component';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [RoomComponent]
})
export class RoomModule { }
