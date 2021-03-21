import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';

import { AvatarSelectionComponent } from './avatar-selection.component';

@NgModule({
  declarations: [
    AvatarSelectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    AvatarSelectionComponent
  ],
  providers: [
    UserService
  ],
  bootstrap: [AvatarSelectionComponent]
})
export class AvatarSelectionModule { }
