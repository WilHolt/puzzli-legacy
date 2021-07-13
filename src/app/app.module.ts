import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomModule } from './room/room.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    SharedModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent],

})
export class AppModule { }
