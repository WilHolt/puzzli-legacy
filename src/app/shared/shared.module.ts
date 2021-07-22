import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoItemComponent } from './components/video-item/video-item.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [VideoItemComponent],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [VideoItemComponent]
})
export class SharedModule { }
