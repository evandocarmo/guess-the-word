import { Component, OnInit,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import {ChatService, Message} from '../chat.service';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer: ElementRef;

  messages: Message[] = [];
  public message:Message = {
    author:'',
    message:''
  };
  nameIsSaved:boolean = false;
  secretWord:string;

  constructor(private chatService:ChatService) { }

  ngAfterViewChecked(){
    this.scrollDown();
  }

  saveName(){
    if(!this.message.author)
      return;
    this.nameIsSaved = true;
  }
  scrollDown(){
    console.log('its alive');
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  }
  sendMsg() {
  if(!this.message.message)
    return;
  if(this.secretWord && this.message.message.toLowerCase().includes(this.secretWord)){
    this.messages.push({
      author:'Server',
      message:"Please, don't give the answer away",
      newDate: new Date().toLocaleString()
    });
    this.message.message = '';
    return;
  }
  this.chatService.messages.next(this.message);
  this.message.message = '';
}

  ngOnInit() {
    this.chatService.messages.subscribe(msg => {
      console.log(msg);
      this.messages.push(msg);
      if(msg.secretWord)
        this.secretWord = msg.secretWord;
      else
        this.secretWord = '';
    });
  }

}
