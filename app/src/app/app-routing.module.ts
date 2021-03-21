
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvatarSelectionComponent } from './views/avatar-selection/avatar-selection.component';
import { RoomListComponent } from './views/room-list/room-list.component';
import { RoomComponent } from './views/room/room.component';

const routes: Routes = [
  {path: '' , component: AvatarSelectionComponent},
  {path: 'rooms' , component: RoomListComponent},
  {path: 'rooms/:id' , component: RoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
