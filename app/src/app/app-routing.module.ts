
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterSelectionComponent } from './views/character-selection/character-selection.component';
import { RoomComponent } from './views/room/room.component';

const routes: Routes = [
  {path: '' , component: CharacterSelectionComponent},
  {path: 'room' , component: RoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
