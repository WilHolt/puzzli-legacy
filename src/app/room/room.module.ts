import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomviewComponent } from './roomview/roomview.component';
import { RoomRoutingModule } from './room-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    RoomviewComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    SharedModule,
    DragDropModule

  ],
  exports:[
    RoomviewComponent,
    RoomRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],


})
export class RoomModule { }
