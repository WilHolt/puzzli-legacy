import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
// import YouTubeplayer from 'youtube-player';
import * as YTPlayer from 'yt-player'
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
  myroom;
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
    const owner = window.history.state.owner
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.roomParams = this.ar.snapshot.params;
    this.socket.on('connectedRoom', (event) => {
      setTimeout( () => {
        console.log(`meu videoTocando`, event)
        console.log(`tempoatual`, this.currentTime);
        this.player.load( event.nowPlaying, 1, this.currentTime);
        // this.player.seek(this.currentTime);
        // this.player.play();
      }, 2000)
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
    player.load('https://www.youtube.com/watch?v=irKx16vfYRs', [false]);
    this.player.play()

    if (owner && owner != undefined) {
      this.player.play()
      this.player.on('timeupdate', currentTime => {
        console.log(currentTime)
        this.socket.emit('updateVideo', { type: 10, currentTime, roomid: this.roomParams.roomid });
      });
      this.player.on('stateChange', state => {
        console.log('state', state)
        // this.socket.emit('updateVideo', { type: 10, currentTime, roomid: this.roomParams.roomid });
      });
      player.on('paused', () => {
        console.log(`paused`)
        console.log('currenttimepaused', this.player.getCurrentTime())
        this.socket.emit('updateVideo', { type: 2, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
      })
      player.on('playing', () => {
        console.log(`layed`)
        this.socket.emit('updateVideo', { type: 1, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
      })
      player.on('ended', () => {
        this.socket.emit('updateVideo', { type: 4, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
      })

    } else {
      this.watchToNotOwner();
    }


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

    setTimeout(() => {
      console.log(this.player, `iniciei not owner`)
      // this.player.mute();
      // // this.player.seek(this.currentTime)
      // this.player.play();

    }, 3000)
    this.socket.on('videoUpdated', event => {
      console.log(event)
      switch (event.type) {
        case 1: {
          console.log(`paly`, event)
          this.currentTime = event.currentTime;
          this.player.seek(event.currentTime)
          this.player.play();
          break;
        }
        case 2: {
          console.log('pause', event)
          this.player.pause();
          this.currentTime = event.currentTime;
          break;
        }
        default: {
          console.log(`dfault`, event.currentTime)
          this.currentTime = event.currentTime;
          break;
        }
      }

    });

  }

  addQueue(inputUrl) {
    console.log(inputUrl)
    console.log(this.roomParams)
    this.socket.emit('loadVideo', { videourl: inputUrl, roomid: this.roomParams.roomid })
    this.socket.on('videoLoaded', videoUrl => {
      console.log(`videoLoaded`, videoUrl)
      this.player.load(videoUrl)

    })
    // console.log(inputUrl)
    // this.myplaylist.push({
    //   url: inputUrl.value,
    // })
  }

  removeQueue() {
    this.myplaylist.pop();
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
