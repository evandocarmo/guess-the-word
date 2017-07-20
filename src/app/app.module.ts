import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { WebsocketService } from './websocket.service';
import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [WebsocketService,ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
