import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import YouTubePlayer from 'youtube-player';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  AfterViewInit  {
  myroom: string;
  title = 'puzzli';
  constructor(
    private socket: Socket,
    private router: Router
  ) { }

  ngAfterViewInit() {

  }


}
