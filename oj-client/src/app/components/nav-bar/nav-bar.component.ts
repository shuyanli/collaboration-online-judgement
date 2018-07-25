import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { FormControl } from '@angular/forms';
import {Subscription} from "rxjs/internal/Subscription";
import {debounceTime} from "rxjs/operators";
import {InputService} from "../../services/input.service";


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  //searchBox  = new FormControl(); //这样也可以貌似
  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(private input: InputService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.searchBox.valueChanges.pipe(debounceTime(200)).subscribe(
      term => {
        this.input.changeInput(term);
      }
    )
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }




}
