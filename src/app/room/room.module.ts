import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomviewComponent } from './roomview/roomview.component';
import { RoomRoutingModule } from './room-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    RoomviewComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    SharedModule
  ],
  exports:[
    RoomviewComponent,
    RoomRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],


})
export class RoomModule { }
