import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomviewComponent } from './roomview/roomview.component';
import { RoomRoutingModule } from './room-routing.module';



@NgModule({
  declarations: [
    RoomviewComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule
  ],
  exports:[
    RoomviewComponent,
    RoomRoutingModule
  ]
})
export class RoomModule { }
