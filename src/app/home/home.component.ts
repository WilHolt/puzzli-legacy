import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import * as uuid from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private socket: Socket
  ) { }

  ngOnInit(): void {
  }
  createRoom(){
    const roomid = uuid.v4().substring(0, 8);
    const roomPayload = {
      id: roomid
    }

    this.socket.emit('createRoom', roomPayload );

    this.router.navigate([`room/${roomid}`], {
      state: {owner: true}
    });
  };

}
