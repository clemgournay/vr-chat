import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { UserService } from 'src/app/services/user.service';

import { CharacterSelectionComponent } from './character-selection.component';

@NgModule({
  declarations: [
    CharacterSelectionComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    CharacterSelectionComponent
  ],
  providers: [
    UserService
  ],
  bootstrap: [CharacterSelectionComponent]
})
export class CharacterSelectionModule { }
