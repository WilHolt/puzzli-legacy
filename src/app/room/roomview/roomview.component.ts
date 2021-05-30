import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
// import YouTubeplayer from 'youtube-player';
import * as YTPlayer from 'yt-player'

interface Room {
  roomid: string;
  roomowner?: {
    id: string;
  };
  playing?: string;
  users: any[];
  playlist?: any;
  musicowner?: {
    id: string;
  };
  nowPlaying: {
    currentTime: number;
  };
}
@Component({
  selector: 'app-roomview',
  templateUrl: './roomview.component.html',
  styleUrls: ['./roomview.component.scss']
})
export class RoomviewComponent implements AfterViewInit {
  nowPlaying = {
    url: ``,
    done: false
  }
  myroom: Room;
  myclientid: string;
  myplaylist: any;
  roomParams;



  player;

  @ViewChild('player') playerElement: ElementRef;

  constructor(
    private socket: Socket,
    private ar: ActivatedRoute
  ) {
    this.myplaylist = new Array<any>();
  }
  inputUrl: string;

  currentTime: number;

  ngAfterViewInit(): void {
    let owner;
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.roomParams = this.ar.snapshot.params;

    this.socket.on('createdRoom', (room: Room) => {
      console.log(`room created`, room)
      this.myroom = room;
      this.myclientid = room.roomowner.id;
    })

    this.socket.on('connectedRoom', ({ room, clientid }) => {
        this.myroom = room;
        this.myclientid = clientid;
        console.log(room, clientid)
        this.player.mute();
        this.player.load(room.playing, 1, room.nowPlaying.currentTime);
        // this.player.seek(room.nowPlaying.currentTime);
        this.player.play();
        this.player.unMute();
    })

    if (window.history.state && !window.history.state.owner) {
      this.socket.emit('connectRoom', { roomid: this.roomParams.roomid });
    }

    const player = new YTPlayer(this.playerElement.nativeElement, {
      videoId: 'Oai8SJ4tkdo',
      height: '100%',
      width: '100%',
      autoplay: true,
      host: 'http://www.youtube.com',
      playerVars: {
        autoplay: 1,
        loop: 1,
        mute: 1, // N.B. here the mute settings.,
        origin: 'http://localhost:4200/'
      },
    })
    console.log(player)
    this.player = player;
    this.player.mute()
    // player.load('https://www.youtube.com/watch?v=irKx16vfYRs', [false]);
    // this.player.play()
    //
    this.socket.on('videoLoaded', (room: Room) => {
      console.log(`videoLoaded`, room)
      this.myroom = { ...this.myroom, ...room }
      console.log(`updatedRoom`, this.myroom)
      this.player.load(room.playing);
      console.log('check', this.myroom.musicowner.id, this.myclientid);


    })

      this._observeVideoUpdate();
      this.watchToNotOwner();

    // this.player.on('playing', (event) => {
    //   console.log(this.player.getDuration()) // => 351.521
    //   console.log(event)
    //   // this.onplayerStateChange(event);

    // })
    // this.player.on('onStateChange', (event) => {
    //   console.log(`event`)

    //   // this.onplayerStateChange(event);
    // })

  }

  watchToNotOwner() {
    this.socket.on('videoUpdated', event => {
      console.log(event)
      switch (event.type) {
        case 1: {
          if (this.myroom.musicowner.id != this.myclientid) {
            console.log(`paly`, event)
            this.currentTime = event.currentTime;
            this.player.seek(event.currentTime)
            this.player.mute();
            this.player.play();
            this.player.unMute();
          }
          break;
        }
        case 2: {
          if (this.myroom.musicowner.id != this.myclientid) {
            this.player.pause();
            this.currentTime = event.currentTime;
          }
          break;
        }
        default: {
          if (this.myroom.musicowner.id != this.myclientid) {
            this.currentTime = event.currentTime;
          }
          break;
        }
      }

    });

  }

  addQueue(inputUrl) {
    console.log(inputUrl, { videourl: inputUrl, roomid: this.roomParams.roomid })
    this.socket.emit('loadVideo', { videourl: inputUrl, roomid: this.roomParams.roomid })

    // console.log(inputUrl)
    // this.myplaylist.push({
    //   url: inputUrl.value,
    // })
  }

  removeQueue() {
    this.myplaylist.pop();
  }

  _observeVideoUpdate() {
    this.player.mute();
    this.player.play()
    this.player.unMute();
    this.player.on('timeupdate', currentTime => {
      if (this.myroom.musicowner.id == this.myclientid) {
        console.log(currentTime)

        this.socket.emit('updateVideo', { type: 10, currentTime, roomid: this.roomParams.roomid });
      }
    });
    this.player.on('stateChange', state => {
      console.log('state', state)
      if (this.myroom.musicowner.id == this.myclientid) { }
      // this.socket.emit('updateVideo', { type: 10, currentTime, roomid: this.roomParams.roomid });
    });
    this.player.on('paused', () => {
      console.log(`paused`)
      console.log('currenttimepaused', this.player.getCurrentTime())
      if (this.myroom.musicowner.id == this.myclientid) {
        this.socket.emit('updateVideo', { type: 2, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });

      }
    })
    this.player.on('playing', () => {
      console.log(`layed`)
      if (this.myroom.musicowner.id == this.myclientid) {
        this.socket.emit('updateVideo', { type: 1, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
      }
    })
    this.player.on('ended', () => {
      if (this.myroom.musicowner.id == this.myclientid) {
        this.socket.emit('updateVideo', { type: 4, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });

      }
    })

  }

  // onplayerStateChange(event) {

  //   console.log(`event`)
  //   if (event.data == YouTubeplayer.playerState.PLAYING && !this.nowPlaying.done) {
  //     setTimeout(() => { this.player }, 6000);
  //     this.nowPlaying.done = true;
  //     this.nowPlaying
  //   }
  // }
}
