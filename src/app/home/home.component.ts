import { Component, OnInit } from '@angular/core';

import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  achievements$: Object;

  getdata(params?: Object, sortBy?: string){
    if(!params)
      params = {};

    this.data.getApprovedAchievements(params)
    .subscribe(
      (data) => {
        this.achievements$ = data
      });
  }

  constructor(private data: DataAccessService, private auth: AuthService) { }

  ngOnInit() {
    this.getdata()
  }

  filter(event){
    event.preventDefault();
    let params = {};



    this.getdata(params);
  }

}
