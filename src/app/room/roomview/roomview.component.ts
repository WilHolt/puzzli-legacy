import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
// import YouTubeplayer from 'youtube-player';
import * as YTPlayer from 'yt-player'
export interface Music {
  title: string;
  id?: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  creator: string;
  duration: any;
  url: string;
  requester?: any;
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
    music?: Music;
    currentTime?: number;
    lasttimecode?: number;
  };
}

@Component({
  selector: 'app-roomview',
  templateUrl: './roomview.component.html',
  styleUrls: ['./roomview.component.scss']
})
export class RoomviewComponent implements AfterViewInit {
  initialized: boolean;
  tapume = true;
  isModalChangeMusicOpen = false;

  // nowPlaying = {
  //   url: ``,
  //   done: false
  // }
  myroom: Room;
  myclientid: string;
  myplaylist: any;
  roomParams;

  nowPlaying: Music;

  playlistOpen = true;


  player;

  @ViewChild('player') playerElement: ElementRef;
  @ViewChild('inputUrl') inputUrlElement: ElementRef;
  @ViewChild('chatbox') chatboxElement: ElementRef;
  @ViewChild('chatboxwrapper') chatboxwrapperElement: ElementRef;
  @ViewChild('playlist') playlistElement: ElementRef;

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
    this.initialized = true;
    let owner;
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.roomParams = this.ar.snapshot.params;

    this.socket.on('createdRoom', ({ room, user }) => {
      console.log(`room created`, room)
      this.myroom = room;
      this.myclientid = user.id;
    })

    this.socket.on('userDisconnectedServer', (room: Room) => {
      this.myroom = room;
    })

    this.socket.on('playlistChanged', (payload) => {
      this.myroom.playlist = payload;
    })

    this.socket.on('connectedRoomServer', ({ room, user }) => {
      console.log('connected user', user.nickname)
    })

    this.socket.on('connectedRoom', ({ room, user }) => {
      this.myroom = room;
      this.myclientid = user.id;
      const play: HTMLElement = document.querySelector('.content');
      play.click()
      const doc = document.createElement('button')
      doc.click();
      this.playerElement.nativeElement.click();
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

    this.socket.on('videoLoaded', (room: Room) => {
      this.myroom = { ...this.myroom, ...room }
      this.player.mute();
      this.player.load(room.nowPlaying.music.id, 1, 0);
      this.player.play();
      this.player.unMute();
      this.nowPlaying = room.playlist[0];
    })

    this.watchToNotOwner();
    this._observeVideoUpdate();

    this.socket.on('videoQueued', (playlist) => {
      this.myroom = { ...this.myroom, playlist }
    })
  }

  watchToNotOwner() {
    this.socket.on('videoStateUpdated', event => {
      switch (event.type) {
        case 1: {
          if (this.myroom.nowPlaying.music.requester.id != this.myclientid) {
            this.player.mute();
            this.player.play();
            this.player.unMute();
          }
          break;
        }
        case 2: {
          if (this.myroom.nowPlaying.music.requester.id != this.myclientid) {
            this.player.pause();
          }
          break;
        }
        default: {
          // quando todos forem dono, todos escutam as mudanças.
          if (this.myroom.nowPlaying.music.requester.id != this.myclientid) {
            this.currentTime = event.value;
            this.player.seek(this.currentTime);
          }
          break;
        }
      }

    });

  }

  focusInput() {
    this.inputUrlElement.nativeElement.focus();
    this.inputUrlElement.nativeElement.scrollIntoView();

  }

  addQueue(inputUrl) {
    this.socket.emit('addQueue', { videoid: this._getIdFromUrl(inputUrl), roomid: this.roomParams.roomid, videourl: inputUrl })
    this._getIdFromUrl(inputUrl);

  }
  playVideo(videourl, music?) {
    this.socket.emit('loadVideo', { roomid: this.roomParams.roomid, music })
  }
  removeQueue() {
    this.myplaylist.pop();
  }

  _observeVideoUpdate() {
    this.player.mute();
    this.player.play()
    this.player.unMute();
    this.player.on('timeupdate', timecode => {
      if (this.myroom.nowPlaying.music.requester.id == this.myclientid) {
        const lasttimecode = this.myroom.nowPlaying.lasttimecode;
        const isTimecodeAdvanced = timecode > lasttimecode;
        const isTimecodeReturned = (timecode - lasttimecode) < 0;
        if (isTimecodeAdvanced || isTimecodeReturned) {
          this.socket.emit('updateVideoState', { type: 10, timecode, roomid: this.roomParams.roomid });
        }
      }
    });

    // this.player.on('stateChange', state => {
    //   console.log('state', state)
    //   if (this.myroom.musicowner.id == this.myclientid) { }
    //   console.log(state)
    //   // this.socket.emit('updateVideo', { type: 10, currentTime, roomid: this.roomParams.roomid });
    // });

    this.player.on('paused', () => {
      if (this.myroom.nowPlaying.music.requester.id == this.myclientid) {
        this.socket.emit('updateVideoState', { type: 2, timecode: this.player.getCurrentTime(), roomid: this.roomParams.roomid });

      }
    })
    this.player.on('playing', () => {
      if (this.myroom.nowPlaying.music.requester.id == this.myclientid) {
        this.socket.emit('updateVideoState', { type: 1, timecode: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
      }
    })
    this.player.on('ended', e => {
      if (this.myroom.nowPlaying.music.requester.id == this.myclientid) {
        this.socket.emit('updateVideoState', { type: 4, timecode: this.player.getCurrentTime(), roomid: this.roomParams.roomid });
        if (this.myroom.playlist.length > 0) {
          this.socket.emit('nextVideo', { roomid: this.myroom.roomid, videourl: this.myroom.playlist[0].url })
        } else {
          this.socket.emit('clearPlaylist', { roomid: this.myroom.roomid })
          this.myroom.playlist = [];
          this.myroom.playing = '';
          this.myroom.nowPlaying.currentTime = 0;
        }

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

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.myroom.playlist, event.previousIndex, event.currentIndex);
    this.socket.emit('changeVideoPosition', { roomid: this.myroom.roomid, playlist: this.myroom.playlist });
  }

  dragStart(e) {
    // console.log(e, 'release')
    const preview = new ElementRef<HTMLElement>(document.querySelector('.cdk-drag.cdk-drag-preview'));
    this.renderer.addClass(preview.nativeElement.firstChild, 'isDragging')
  }
  dragEnd(e) {
  }

  skipVideo(music) {
    this.socket.emit('skipVideo', { roomid: this.myroom.roomid, music });

  }

  copyUrl() {
    const textToCopy = window.location.href
    navigator.clipboard.writeText(textToCopy)
      .then(() => { alert(`Link de Convite Copiado, envie para seus amigos!`) })
      .catch((error) => { alert(`Copy failed! ${error}`) })
  }
}
