import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { CharacterSelectionModule } from './views/character-selection/character-selection.module';
import { RoomModule } from './views/room/room.module';
import { ChatModule } from './components/chat/chat.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CharacterSelectionModule,
    RoomModule,
    ChatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
