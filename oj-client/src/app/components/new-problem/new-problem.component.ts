import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';


const DEFAULT_PROBLEM: Problem = Object.freeze({ id: 0,
  name: '',
  desc: '',
  difficulty: 'easy'
})
@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }
  //之所以能得到这个newProblem是因为前端有一个ngmodel绑定了上面三个field, 因为two way binding
  //所以ts里面就能立刻更新得到这个值, 等于说每次进来先建立一个空的object, 然后通过前端改写改变对应field的值
  //然后再call完addproblem这个service以后再次清空这个object
  addProblem () {
    this.dataService.addProblem(this.newProblem);
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }

}
