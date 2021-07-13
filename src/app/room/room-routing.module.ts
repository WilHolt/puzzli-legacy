import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomviewComponent } from './roomview/roomview.component';

const routes: Routes = [
  {
    path: ':roomid',
    component: RoomviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
