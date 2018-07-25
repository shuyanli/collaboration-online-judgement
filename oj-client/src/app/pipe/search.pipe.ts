import { Pipe, PipeTransform } from '@angular/core';
import {Problem} from "../models/problem.model";

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(problems : Problem[], term:string): any {
    console.log(problems);
    console.log(term);

    return problems.filter(problems =>
      problems.name.toLowerCase().includes(term)  //todo: 这里加上大括号和没有大括号是否一样? =>加上就不显示list了
    );
  }

}
