import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoItemComponent } from './components/video-item/video-item.component';



@NgModule({
  declarations: [VideoItemComponent],
  imports: [
    CommonModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [VideoItemComponent]
})
export class SharedModule { }
