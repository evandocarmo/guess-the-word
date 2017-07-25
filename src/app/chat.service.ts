import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {WebsocketService} from './websocket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

const CHAT_URL = "wss://" + window.location.host + "/socket";

export interface Message {
	author: string,
	message: string,
	newDate?: string,
  role?:string,
  secretWord?:string
}

@Injectable()
export class ChatService {
  public messages: Subject<Message>  = new Subject<Message>();
  constructor(private wsService: WebsocketService) {
      this.messages = <Subject<Message>>this.wsService.connect(CHAT_URL)
      .map((response:MessageEvent):Message=>{
        let data = JSON.parse(response.data);
        return data;
      });
  }
}
