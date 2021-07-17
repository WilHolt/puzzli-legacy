import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
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
 constructor(  private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  this.matIconRegistry.addSvgIcon(
    'skip_video',
    this.domSanitizer.bypassSecurityTrustResourceUrl(
      'assets/skip-playlist-video-icon.svg'
    )
  );
 }
  ngOnInit(): void {
  }

}
