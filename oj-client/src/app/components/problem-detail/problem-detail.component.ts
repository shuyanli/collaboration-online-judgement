import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}
  //activatedroute作用是当前激活的page, 用于得到当前路径的信息
  ngOnInit() {
    this.route.params.subscribe(params => { //监听route.params,将resolve的值用作后面的这个方程
      console.log(params); //params就是/id的这个数字
      this.dataService.getProblem(+params['id'])
        .then(problem => this.problem = problem);
    });
  }

}
