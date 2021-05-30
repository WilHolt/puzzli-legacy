import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomModule } from './room/room.module';
import { HomeComponent } from './home/home.component';
const config: SocketIoConfig = { url: 'https://puzzlapi2.herokuapp.com/', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

  ],
  imports: [
    RoomModule,
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
