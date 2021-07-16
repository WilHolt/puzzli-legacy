import { Component, Input, OnInit } from '@angular/core';
import { Music } from 'src/app/room/roomview/roomview.component';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent implements OnInit {
 @Input() open : boolean;
 @Input() active : boolean;
 @Input() nothover? : boolean;
 @Input() video: Music
  constructor() { }

  ngOnInit(): void {
  }

}
