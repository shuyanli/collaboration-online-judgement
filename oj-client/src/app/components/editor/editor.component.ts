import { Component, OnInit } from '@angular/core';
import {CollaborationService} from '../../services/collaboration.service';
import {ActivatedRoute, Params} from "@angular/router";
import {DataService} from "../../services/data.service";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Subscription} from "rxjs/internal/Subscription";


declare var ace:any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  languages : string[] = ['Java','Python' ];
  language : string = 'Java';
  editor:any;
  sessionID: string = '';
  output:string = '';
  coders: string;
  subscriptionCoders:Subscription;

  defaultContent = {
    'Java': ` public class Example {
        public static void main(String[] args) {
           // Type your Java code here
          }
     }`,
    'Python': `class Solution: 
      def example():
        #write your code here: S
        `,
  };//use `` to write multi-line text

  constructor(private collaboration:CollaborationService,
              private  route : ActivatedRoute,
              private dataService: DataService,
              ) {}

  ngOnInit() {
    this.route.params.subscribe( params=> {
      this.sessionID = params['id'];
      console.log('initEditor called');
      this.initEditor();
    });

    this.collaboration.restoreBuffer();

  }

  initEditor ():void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();

    document.getElementsByTagName('textarea')[0].focus();//光标锁定editor

    this.subscriptionCoders = this.collaboration.onInit(this.editor, this.sessionID)
      .subscribe(coders=> {
        this.coders= coders;
      });

    this.editor.lastAppliedChange = null;  //自动获取,不需要update

    //下面这个是在editor主动变的, 然后
    this.editor.on('change', (e)=>{   //e: evant, an object. event based program,只要开始,如果不去取消,就会一直去监听,一有变化就回去做下面的这些事情
      console.log('last change on editor: '+JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {  //这里避免了回传
        console.log("different changes applied");
        this.collaboration.change(JSON.stringify(e));
      }else{
        console.log("same change as last one, ignored");
      }
    })
  }
  resetEditor():void {
    this.editor.setValue(this.defaultContent[this.language]); //todo注意这里调用array[i]的写法
    this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());

  }
  setLanguage (language:string):void {
    this.language = language;
    this.resetEditor();
  }

  submit ():void {
    let user_code = this.editor.getValue();

    const data = {
      code: user_code,
      lang: this.language.toLowerCase()
    }
    console.log(data)
    //将data发送给后端,同时将response在前段显示出来
    this.dataService.buildAndRun(data).then(res => this.output = res);
  }

}

/*终于弄明白顺序了:
总: 发送(emit)一个"change" event给server:

editor.component.ts -> initEditor-> this.editor.on监听->如果editor发生->call this.collaboration.change
->来到了collaboration.service.ts -> call change()->this.collaborationSocket.emit("change", delta)
->来到了editorSocketService-> socket.on('change'...注意这个文件在启动server的时候已经读过了,所以这个on一直在工作等待'change')
->31行 io.to(participants[i]).emit("change", delta)->回到collaboration.service
->20行 this.collaborationSocket.on("change"...)->写入change->结束
*/
