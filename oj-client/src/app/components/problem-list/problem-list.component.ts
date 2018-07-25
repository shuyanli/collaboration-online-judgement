import { Component, OnInit, OnDestroy } from '@angular/core';
import {Problem} from '../../models/problem.model';
import {DataService} from '../../services/data.service';
import {Subscription} from "rxjs/internal/Subscription";
import {InputService} from "../../services/input.service";

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit, OnDestroy {
  problems: Problem[];
  subscriptionProblems : Subscription;
  subscriptionInput: Subscription;
  searchTerm : string = '';

  constructor(private dataService: DataService, private inputService: InputService) { }

  ngOnInit() {//因为我对你这两个数据感兴趣,所以起来的时候我就开始监听你们的变化
    this.getProblems();
    this.getSearchTerm();
  }

  ngOnDestroy() {
    this.subscriptionProblems.unsubscribe();
  }

  getProblems () {
    this.subscriptionProblems = this.dataService.getProblems()
      .subscribe(problems => {this.problems = problems})
  }

  getSearchTerm ():void {
    this.subscriptionInput = this.inputService.getInput()
      .subscribe(inputTerm => this.searchTerm = inputTerm  // 这个地方不加括号为什么就可以
    );
  }

}
