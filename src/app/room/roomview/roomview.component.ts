import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
// import YouTubeplayer from 'youtube-player';
import * as YTPlayer from 'yt-player'
export interface Music {
  title: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  creator: string;
  duration: any;
}
interface Room {
  roomid: string;
  roomowner?: {
    id: string;
  };
  playing?: string;
  users: any[];
  playlist?: Music[];
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
  tapume = true;
  isModalChangeMusicOpen = false;

  nowPlaying = {
    url: ``,
    done: false
  }
  myroom: Room;
  myclientid: string;
  myplaylist: any;
  roomParams;

  playlistOpen = true;


  player;

  @ViewChild('player') playerElement: ElementRef;

  constructor(
    private socket: Socket,
    private ar: ActivatedRoute,
    private renderer: Renderer2
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
      const play: HTMLElement = document.querySelector('.content');
      console.log(this.playerElement.nativeElement)
      play.click()
      const doc = document.createElement('button')
      doc.click();
      this.playerElement.nativeElement.click();
      const featurePolicy = this.player
      console.log(featurePolicy)
      // featurePolicy.allowsFeature("play()")

      this.player.load(room.playing, 1, room.nowPlaying.currentTime);
      // this.player.seek(room.nowPlaying.currentTime);
      this.player.mute();
      this.player.play();
      this.player.unMute();
    })

    if (window.history.state && window.history.state.owner) {
      this.tapume = false;
    }

    const player = new YTPlayer(this.playerElement.nativeElement, {
      videoId: 'Oai8SJ4tkdo',
      height: '100%',
      width: '100%',
      autoplay: true,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 1,
        loop: 1,
        mute: 0, // N.B. here the mute settings.,
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
      // this.player.load(room.playing);
      this.player.mute();
      this.player.load(room.playing, 1, 0);
      // this.player.seek(room.nowPlaying.currentTime);
      this.player.play();
      this.player.unMute();
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
    this.socket.on('videoQueued', (playlist) => {
      // this.myroom.playlist = playlist;
      this.myroom  = {...this.myroom, playlist}
      console.log(this.myroom)
    })
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
    console.log(inputUrl, { videourl: this._getIdFromUrl(inputUrl), roomid: this.roomParams.roomid })
    this.socket.emit('addQueue', { videoid: this._getIdFromUrl(inputUrl), roomid: this.roomParams.roomid, videourl: inputUrl })
    this._getIdFromUrl(inputUrl);
    // console.log(inputUrl)
    // this.myplaylist.push({
    //   url: inputUrl.value,
    // })
  }
  playVideo(videourl){
    this.socket.emit('loadVideo', { videourl, roomid: this.roomParams.roomid })
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
      if (this.myroom.musicowner.id == this.myclientid) {
        console.log(`paused`)
        console.log('currenttimepaused', this.player.getCurrentTime())
        this.socket.emit('updateVideo', { type: 2, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });

      }
    })
    this.player.on('playing', () => {
      if (this.myroom.musicowner.id == this.myclientid) {
        console.log(`layed`)
        this.socket.emit('updateVideo', { type: 1, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
      }
    })
    this.player.on('ended', () => {
      if (this.myroom.musicowner.id == this.myclientid) {
        this.socket.emit('updateVideo', { type: 4, currentTime: this.player.getCurrentTime(), roomid: this.roomParams.roomid });

      }
    })

  }

  connect() {
    this.socket.emit('connectRoom', { roomid: this.roomParams.roomid });
    this.tapume = false;
  }

  _getIdFromUrl(videoUrl) {
    const getEntireIdQueryRegex = /(v)([\=])([\w\d_-]+)([\?\&])?/g;
    const cleanQueryRulesRegex = /(?:v=|&)/g;
    return videoUrl.match(getEntireIdQueryRegex)[0].replace(cleanQueryRulesRegex, '');
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
