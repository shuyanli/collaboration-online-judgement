import { Injectable } from '@angular/core';
import { Problem} from '../models/problem.model';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _problemResource = new BehaviorSubject<Problem[]>([])
  constructor(private httpClient: HttpClient) { }

  //todo: 这个方程能不能像下面那个改写,是不是一定要先变成behaviorsubject再变回observable? 下面那个为什么不用behaviorsubject
  //我的想法是: behaviorsubject是有初始值的,我们要得到所有problem, 如果只用observable就有可能遇到需要刷新一下才出数据的可能

  //note:subject是multicast的。记得我们讲过的例子就是好像听演唱会，你什么时候入场，什么时候开始听。有初始值
  //observable像是听CD，你订阅后从头开始听。可以根据需要进行选择。没有初始值
  getProblems (): Observable<Problem[]> {
    this.httpClient.get('api/v1/problems')  //get will return an observable
      .toPromise()
      .then( (res:any) => {
        this._problemResource.next(res);
      })
      .catch(this.handleError);

    return this._problemResource.asObservable();
  }

  getProblem (id: number): Promise<Problem> {
    return this.httpClient.get(`api/v1/problems/${id}`)
      .toPromise()
      .then ( (res:any) => res)
      .catch(this.handleError);
  }

  addProblem (problem: Problem) {
    const option = {headers: new HttpHeaders({'Content-Type' : 'application/json'})};

    return this.httpClient.post('api/v1/problems',problem, option)
      .toPromise()
      .then ( (res:any) => {
        this.getProblems();
        return res; //这个res是服务器传回的新建的这个包含id, name, disc和各种乱七八糟的信息的object, 真正需要返回的东西
      })
      .catch(this.handleError);
  }



  //这里想rest.js服务里面发送这个解析后的data
  buildAndRun(data) : Promise<any>{
    const option = {headers: new HttpHeaders({'Content-Type' : 'application/json'})};
    return this.httpClient.post('api/v1/build_and_run', data, option)
      .toPromise()
      .then( (res:any)=>{
        console.log('the result we got is: '+res);
        return res;
      })
      .catch(this.handleError);
  }





  private handleError (error: any): Promise<any>{
      console.log('data.service.ts handleError called');
      return Promise.reject(error.body || error);
  }

}
