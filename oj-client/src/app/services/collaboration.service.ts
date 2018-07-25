import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import { Subject} from 'rxjs';
declare var io :any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocket : any;
  private _allCoders = new Subject<string>();
  constructor() { }


  onInit (editor: any, sessionId: string):Observable<string> {  //与服务器"握手" 这个方程定义了当server收到请求时做出的反应
    //this.collaborationSocket = io(window.location.origin, {query: 'message = hahaha'});//建立socket
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' +sessionId });

    this.collaborationSocket.on("message", (message) => {   //当...发生的时候, 如当我收到message的时候
      console.log('this is client, and message from server : ' + message);
    });

    this.collaborationSocket.on("change", (delta:string) =>{ //todo: 这个是怎么用的=>这里就server定义的event
      //通过调试发现这个是其他socketid跟着编辑后的socketid动的, 被动
      console.log('colleboration editor changed by : '+ delta);
      delta = JSON.parse(delta);  //change string to an object
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]); //真正写入editor
    });

    this.collaborationSocket.on("coderChange", (data:string) =>{
      console.log('current coders in this session is:' + data);
      this._allCoders.next(data.toString());

    })
     return this._allCoders.asObservable();

  };

  change (delta:string):void {  //todo: 猜想,这个emit是不是发给了上面的20行 .on("change")?
    //通过调试发现这个不是跟着上面on的, 这个是editor.component里53行传过来的, 然后发到emit, 执行了
    //ace的一大堆代码,然后结束, 紧接着另一个窗口的20行开始执行,跟着"被动"输入值
    //注意, 13-19行在被动的时候并没有被call, 所以event driven不是从oninit开始, 而是直接从on("event")开始

    this.collaborationSocket.emit("change", delta);

  }



  restoreBuffer ():void {
    this.collaborationSocket.emit("restoreBuffer");
  }
}
