import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Observer} from "rxjs/Observer";
@Injectable()
export class WebsocketService {
  private subject : Subject<MessageEvent>;

  public connect(url:string):Subject<MessageEvent>{
    if(!this.subject)
      this.subject = this.create(url);
    return this.subject;
  }

  private create(url:string):Subject<MessageEvent>{
    let socket = new WebSocket(url);

    let observable = Observable.create((observer:Observer<MessageEvent>)=>{
      socket.onmessage = observer.next.bind(observer);
      socket.onerror = observer.error.bind(observer);
      socket.onclose = observer.complete.bind(observer);

      return socket.close.bind(observer);
    });
    let outObserver = {
      next: (data:Object) => {
        if(socket.readyState === WebSocket.OPEN)
          socket.send(JSON.stringify(data));
      }
    }
    return Subject.create(outObserver,observable);
  }

  constructor() { }

}
